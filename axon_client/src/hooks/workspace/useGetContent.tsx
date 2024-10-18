
import axios from 'axios';
import { toast } from 'sonner';
import type { AxonError, CommonWorkspaceResponse } from '@/types';

const fetchWorkspaceContent = async (workspaceId: string) => {
   try {
      const response = await axios.get<CommonWorkspaceResponse>('http://localhost:3001/api/workspace/content', { params: { workspaceId }, withCredentials: true });
      console.log(response.data)
      return response.data;
   } catch (error) {
      const axiosError = error as AxonError;
      toast.error('Failed to fetch workspace content', {
         description: `Error: ${axiosError.response?.data.message || 'Unknown error'}`,
         className: 'bg-neutral-900 border border-neutral-800',
         action: {
            label: 'Close',
            onClick: () => console.log('closed error notification'),
         },
      });
      throw error;
   }
};

const useGetWorkspaceContent = () => {
   return {
      fetchWorkspaceContent,
   };
};

export default useGetWorkspaceContent;