import { useLocation, useSearchParams } from "react-router-dom";

function useQueryParam(paramName: string) {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  return params.get(paramName);
};
export default useQueryParam;