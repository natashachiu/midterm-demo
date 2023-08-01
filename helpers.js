const formatDate = (dateObj) => {
  return new Date(dateObj).toLocaleDateString(
    'en-gb',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'utc'
    });
};

module.exports = { formatDate };
