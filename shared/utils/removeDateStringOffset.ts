export const removeDateStringOffset = (str: string) => {
  // UTC represenation
  if (str.includes('Z')) {
    return str.split('Z')[0];
  }

  // positive offset
  if (str.includes('+')) {
    return str.split('+')[0];
  }

  // negative offset
  if (str.includes('T')) {
    const [time, date] = str.split('T');
    if (date.includes('-')) {
      return `${time}T${date.split('-')[0]}`;
    }
  }

  // no offset or UTC representation
  return str;
};
