import { NestedStack, RemovalPolicy } from 'aws-cdk-lib';
import { Certificate, DnsValidatedCertificate } from 'aws-cdk-lib/aws-certificatemanager';
import { Role } from 'aws-cdk-lib/aws-iam';
import {
  CfnHealthCheck,
  CrossAccountZoneDelegationRecord,
  HostedZone,
  IHostedZone,
  PublicHostedZone,
} from 'aws-cdk-lib/aws-route53';
import { Construct } from 'constructs';

import { CrossRegionMetricAlarm, CrossRegionSNSTopic } from '~/constructs';
import { appEnvs } from '~/consts';
import { getEnvName } from '~/utils';

export class Zone extends NestedStack {
  public readonly certificate: Certificate;

  public readonly hostedZone: HostedZone | IHostedZone;

  constructor(scope: Construct) {
    super(scope, 'Zone');

    const route53Region = 'us-east-1';
    const {
      appDomain,
      hostedZoneId,
      parentHostedZoneId,
      parentHostedZoneRoleArn,
      healthCheckAlarmEmails,
    } = appEnvs[getEnvName(this)];

    if (hostedZoneId) {
      this.hostedZone = PublicHostedZone.fromHostedZoneAttributes(this, 'Zone', {
        zoneName: appDomain,
        hostedZoneId,
      });
    } else {
      this.hostedZone = new PublicHostedZone(this, 'Zone', { zoneName: appDomain });
    }

    if (parentHostedZoneId && parentHostedZoneRoleArn) {
      const delegationRole = Role.fromRoleArn(
        this,
        'delegationRole',
        parentHostedZoneRoleArn
      );

      new CrossAccountZoneDelegationRecord(this, 'ZoneDelegationRecord', {
        delegationRole,
        parentHostedZoneId,
        delegatedZone: this.hostedZone,
        removalPolicy: RemovalPolicy.DESTROY,
      });
    }

    this.certificate = new DnsValidatedCertificate(this, 'Certificate', {
      hostedZone: this.hostedZone,
      domainName: appDomain,
      subjectAlternativeNames: [`*.${appDomain}`],
      region: route53Region,
      cleanupRoute53Records: true,
    });

    const healthCheck = new CfnHealthCheck(this, 'HealthCheck', {
      healthCheckConfig: {
        type: 'HTTPS',
        fullyQualifiedDomainName: appDomain,
        requestInterval: 30,
        failureThreshold: 3,
      },
    });

    const healthCheckAlarmSnsTopic = new CrossRegionSNSTopic(
      this,
      'route53HealthCheckTopic',
      {
        region: route53Region,
        createTopicInput: { Name: 'Route53HealthCheck' },
        subscribeInputs: healthCheckAlarmEmails?.map((Endpoint) => ({
          Endpoint,
          Protocol: 'email',
        })),
      }
    );

    new CrossRegionMetricAlarm(this, `HealthCheckAlarm`, {
      region: route53Region,
      putMetricAlarmInput: {
        AlarmName: 'route53HealthCheck',
        Namespace: 'AWS/Route53',
        MetricName: 'HealthCheckStatus',
        Statistic: 'Minimum',
        ComparisonOperator: 'LessThanThreshold',
        Threshold: 1,
        Period: 60,
        EvaluationPeriods: 1,
        AlarmActions: [healthCheckAlarmSnsTopic.arn],
        Dimensions: [
          {
            Name: 'HealthCheckId',
            Value: healthCheck.attrHealthCheckId,
          },
        ],
      },
    });
  }
}
