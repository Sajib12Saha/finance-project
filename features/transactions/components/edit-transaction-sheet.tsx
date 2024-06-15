'use client'


import { Sheet, SheetContent, SheetDescription, SheetHeader,SheetTitle } from "@/components/ui/sheet";
import { z } from "zod";
import { insertTransactionsSchema } from '@/db/schema';
import { TransactionForm } from "@/features/transactions/components/transaction-form";

import { useOpenTransaction } from "@/features/transactions/hooks/use-open-transaction";
import { useGetTransaction } from '@/features/transactions/api/use-get-transaction';
import { Loader2 } from "lucide-react";
import { useEditTransaction } from "@/features/transactions/api/use-edit-transaction";
import {useDeleteTransaction} from '@/features/transactions/api/use-delete-transaction';
import { useConfirm } from "@/hooks/use-confirm";
import { useGetCategories } from "@/features/categories/api/use-get-categories";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { useCreateCategory } from "@/features/categories/api/use-create-category";
import { useCreateAccount } from "@/features/accounts/api/use-create-account";





const formSchema = insertTransactionsSchema.omit({
    id: true,

})

type FormValues = z.input<typeof formSchema>;

export const EditTransactionSheet = ()=>{

  const {isOpen, onClose, id} = useOpenTransaction();

  const [ConfirmDialog, confirm] = useConfirm(
    'Are you sure? ', 
    'You are about to delete this transaction'
  )

  const transactionQuery = useGetTransaction(id)
  const editMutation = useEditTransaction(id);
  const deleteMutation = useDeleteTransaction(id)

  const categoryQuery = useGetCategories()
  const categoryMutation = useCreateCategory();
  
  const onCreateCategory = (name: string) => categoryMutation.mutate({
    name
  });
  const categoryOptions = (categoryQuery.data ?? [] ).map((category) => ({

      label: category.name,
      value: category.id,
     
  }));

  const accountQuery = useGetAccounts()
  const accountMutation = useCreateAccount();

  const onCreateAccount = (name: string) => accountMutation.mutate({
    name
  });
  const accountOptions = (accountQuery.data ?? [] ).map((account) => ({

      label: account.name,
      value: account.id,
     
  }));



  const isPending = editMutation.isPending || deleteMutation.isPending || transactionQuery.isLoading || categoryMutation.isPending || accountMutation.isPending;

  const isLoading = transactionQuery.isLoading || categoryQuery.isLoading || accountQuery.isLoading;

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

    const defaultValues = transactionQuery.data ? {
        accountId: transactionQuery.data.accountId,
        categoryId: transactionQuery.data.categoryId,
        amount: transactionQuery.data.amount.toString(),
        date: transactionQuery.data.date ? new Date(transactionQuery.data.date) : new Date(),
        payee: transactionQuery.data.payee,
        notes: transactionQuery.data.notes,

    } : {
        accountId: "",
        categoryId: "",
        amount: "",
        date: new Date(),
        payee: "",
        notes: "",
        
    } 
    
    return(


        <>
        <ConfirmDialog/>
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="space-y-40">
                <SheetHeader>
                    <SheetTitle>
                        Edit Transaction
                    </SheetTitle>
                    <SheetDescription>
                        Edit and Exiting transaction to track your transaction.
                    </SheetDescription>
                </SheetHeader>
                { isLoading
                ?
                  (
                    <div className="absolute inset-0 items-center justify-center">
                        <Loader2 className="size-4 text-muted-foreground animate-spin"/>

                    </div>

                ) : (
                
                    <TransactionForm
                  
                    id={id}
                    defaultValues={defaultValues}
                    onSubmit={onSubmit}
                    onDelete={onDelete}
                    disabled={isPending}
                    categoryOptions={categoryOptions}
                    accountOptions={accountOptions}
                    onCreateAccount={onCreateAccount}
                    onCreateCategory={onCreateCategory}/>
        )
}
            </SheetContent>
        </Sheet>
        </>
    )
}