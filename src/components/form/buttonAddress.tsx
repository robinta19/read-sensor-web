import { useRouter } from 'next/navigation';
import React from 'react'
import { useIpAddress } from '../parts/ipAddress/api';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { IpAddressFormPayload, ipAddressFormSchema } from '../parts/ipAddress/validation';
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Form } from '../ui/form';
import { CustomFormInput } from './customFormInput';

const ButtonAddress = () => {
    const router = useRouter();
    const createIpAddressMutation = useIpAddress("POST");

    const form = useForm<IpAddressFormPayload>({
        resolver: zodResolver(ipAddressFormSchema),
        defaultValues: {
            name: "",
        },
    });

    const onSubmit = (data: IpAddressFormPayload) => {
        console.log(data);
        createIpAddressMutation.mutate(data, {
            onSuccess: () => {
                router.push("/");
            },
        });
    };
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Edit IP Address</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <DialogHeader>
                            <DialogTitle>Edit IP Address</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4">
                            <CustomFormInput<IpAddressFormPayload>
                                name="name"
                                label="IP Address"
                                placeholder="Masukkan IP Address"
                                inputClassName='rounded-md h-10 text-sm'
                            />
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Batal</Button>
                            </DialogClose>
                            <Button
                                className="bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
                                disabled={!form.formState.isValid}
                                type="submit">Simpan</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default ButtonAddress