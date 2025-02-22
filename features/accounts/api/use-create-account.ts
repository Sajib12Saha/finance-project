import { client } from '@/lib/hono'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {InferRequestType, InferResponseType} from 'hono'
import { toast } from 'sonner';



type ResponseType = InferResponseType<typeof client.api.accounts.$post>;

type RequestType = InferRequestType<typeof client.api.accounts.$post>['json'];

export const useCreateAccount = ()=>{

    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType,Error,RequestType>({
        
        mutationFn: async(json) => {
            const reponse = await client.api.accounts.$post({json});
            return await reponse.json();

        },
        onSuccess : ()=>{
            toast.success('Account Created')
            queryClient.invalidateQueries({queryKey: ['accounts']});
        },
        onError: ()=>{
            toast.error('Failed to create account');
        },
    });

    return mutation;

};