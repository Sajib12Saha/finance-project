'use client'


import { Sheet, SheetContent, SheetDescription, SheetHeader,SheetTitle } from "@/components/ui/sheet";
import { z } from "zod";
import { insertAccountSchema } from '@/db/schema';
import { AccountForm } from "@/features/accounts/components/account-form";

import { useOpenAccount } from "../hooks/use-open-account";
import { useGetAccount } from './../api/use-get-account';
import { Loader2 } from "lucide-react";
import { useEditAccount } from "../api/use-edit-account";
import {useDeleteAccount} from '@/features/accounts/api/use-delete-account'
import { useConfirm } from "@/hooks/use-confirm";





const formSchema = insertAccountSchema.pick({
    name: true,

})

type FormValues = z.input<typeof formSchema>;

export const EditAccountSheet = ()=>{

  const {isOpen, onClose, id} = useOpenAccount();

  const [ConfirmDialog, confirm] = useConfirm(
    'Are you sure? ', 
    'You are about to delete this account'
  )

  const accountQuery = useGetAccount(id)
  const editMutation = useEditAccount(id);
  const deleteMutation = useDeleteAccount(id)


  const panding = editMutation.isPending || deleteMutation.isPending;

  const isLoading = accountQuery.isLoading 

  const onSubmit = (values:FormValues)=>{
    editMutation.mutate(values, {
        onSuccess: () =>{
            onClose();
        },
    });
    };


    const onDelete = async ()=>{
        const ok = await confirm();
        if(ok) {
            deleteMutation.mutate(undefined, {
                onSuccess: () => {
                    onClose();
                }
            } );
        }
    }

    const defaultValues = accountQuery.data ? {
        name: accountQuery.data.name
    } : {
        name: "",
    } 
    
    return(


        <>
        <ConfirmDialog/>
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="space-y-4">
                <SheetHeader>
                    <SheetTitle>
                        Edit Account
                    </SheetTitle>
                    <SheetDescription>
                        Edit and Exiting account to track your accounts.
                    </SheetDescription>
                </SheetHeader>
                { isLoading
                ?
                  (
                    <div className="absolute inset-0 items-center justify-center">
                        <Loader2 className="size-4 text-muted-foreground animate-spin"/>

                    </div>

                ) : (
                
                <AccountForm
                id={id}
                onSubmit={onSubmit } disabled={panding }
                defaultValues={defaultValues}
                onDeleted={onDelete}
                />
            )}

            </SheetContent>
        </Sheet>
        </>
    )
}