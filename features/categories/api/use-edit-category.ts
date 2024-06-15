import { client } from '@/lib/hono'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {InferRequestType, InferResponseType} from 'hono'
import { toast } from 'sonner';



type ResponseType = InferResponseType<typeof client.api.categories[':id']['$patch']>;

type RequestType = InferRequestType<typeof client.api.categories[':id']['$patch']>['json'];



export const useEditCategory = (id?: string) => {

    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType,Error,RequestType>({
        
        mutationFn: async (json) => {
            const reponse = await client.api.categories[':id']['$patch']({ 
                param: {id},
                 json,
                
            });
            return await reponse.json();

        },
        onSuccess : ()=> {
            toast.success('Category Updated')
            queryClient.invalidateQueries({queryKey: ['categories', {id}]});
            queryClient.invalidateQueries({queryKey: ['categories']});
            queryClient.invalidateQueries({queryKey: ['transactions']});
            queryClient.invalidateQueries({queryKey: ['summary']});

        },   
        onError: ()=>{
            toast.error('Failed to edit category');
        },
    });

    return mutation;

};