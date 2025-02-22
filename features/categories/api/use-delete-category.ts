import { client } from '@/lib/hono'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferResponseType} from 'hono'
import { toast } from 'sonner';



type ResponseType = InferResponseType<typeof client.api.categories[':id']['$delete']>;





export const useDeleteCategory = (id?: string) => {

    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType,Error>({
        
        mutationFn: async (json) => {
            const reponse = await client.api.categories[':id']['$delete']({ 
                param: {id},
                 
                
            });
            return await reponse.json();

        },
        onSuccess : ()=> {
            toast.success('Category Deleted')
            queryClient.invalidateQueries({queryKey: ['categories', {id}]});
            queryClient.invalidateQueries({queryKey: ['categories']});
            queryClient.invalidateQueries({queryKey:['transactions']})
            queryClient.invalidateQueries({queryKey:['summary']})
        },
        onError: ()=>{
            toast.error('Failed to delete category');
        },
    });

    return mutation;

};