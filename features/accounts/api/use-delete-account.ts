import { client } from '@/lib/hono'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {InferRequestType, InferResponseType} from 'hono'
import { toast } from 'sonner';



type ResponseType = InferResponseType<typeof client.api.accounts[':id']['$delete']>;





export const useDeleteAccount = (id?: string) => {

    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType,Error>({
        
        mutationFn: async (json) => {
            const reponse = await client.api.accounts[':id']['$delete']({ 
                param: {id},
                 
                
            });
            return await reponse.json();

        },
        onSuccess : ()=> {
            toast.success('Account Deleted')
            queryClient.invalidateQueries({queryKey: ['accounts', {id}]});
            queryClient.invalidateQueries({queryKey: ['accounts']});
            queryClient.invalidateQueries({queryKey: ["transactions"]})
        },
        onError: ()=>{
            toast.error('Failed to delete account');
        },
    });

    return mutation;

};