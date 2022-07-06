import { ISocketQueryParams } from "../../interfaces/webSocket/message";

class ParseUrl {
  static getQueryParams(url: string | undefined) {
    if (!url) {
      return {};
    }

    const queryParamsString = url.match(/(?<=\?).*/);
    const queryParamsObj: ISocketQueryParams = {};
    const queryParamsArr = queryParamsString && queryParamsString[0] ? queryParamsString[0].split("&") : [];

    queryParamsArr.forEach(query => {
      const queryKeyVal = query.split("=");
      const prevSameKeyQueryVal = queryParamsObj[queryKeyVal[0]];

      if (prevSameKeyQueryVal) {
        const newValue = Array.isArray(prevSameKeyQueryVal) ? prevSameKeyQueryVal.push(queryKeyVal[1]) : [prevSameKeyQueryVal, queryKeyVal[1]]
        queryParamsObj[queryKeyVal[0]] = newValue
      } else {
        queryParamsObj[queryKeyVal[0]] = queryKeyVal[1]
      }
    });

    return queryParamsObj;
  }
};

export default ParseUrl;