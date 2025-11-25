import SiteList from "../../components/SiteList";
import { useQuery } from '@tanstack/react-query';
import { sitesApi } from '../../api';

function HomeIndex() {

  const { data: sites = [], isLoading, error } = useQuery({
    queryKey: sitesApi.queryKey,
    queryFn: sitesApi.queryFn,
    staleTime: Infinity,
  });
  
  return (
    <>
      {isLoading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      {sites.length > 0 && <SiteList sites={sites} />}
    </>
  );
}

export default HomeIndex;
