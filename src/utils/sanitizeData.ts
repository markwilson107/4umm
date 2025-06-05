function sanitizeData(data: any, keysToKeep: string[]): any {
  const dataCopy = { ...data.toObject() };

  const sanitizedData: any = {};

  keysToKeep.forEach((key: string) => {
    if (dataCopy.hasOwnProperty(key)) {
      sanitizedData[key] = dataCopy[key];
    }
  });

  return sanitizedData;
}

export { sanitizeData };