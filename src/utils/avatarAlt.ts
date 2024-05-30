const avatarAlt = (value: string) => {
  const ava = value
    .toUpperCase()
    .match(/\b(\w)/g)
    ?.join("")
    .substring(0, 2);
  return ava;
};

export default avatarAlt;
