export const getDesiredDataFromPreview = (arr: any, key: string) => {
  let modifiedArray: any = [];
  let _id = "";
  arr.forEach((element: any) => {
    if (element.step === key || element.slug === key) {
      modifiedArray = element.data;
      _id = element._id;
    }
  });
  return { data: modifiedArray, _id: _id };
};
