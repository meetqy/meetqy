import React from 'react'
import {Button} from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import NameForm from "@/components/name-form";
import {ArrowRight} from "lucide-react";

const FormDialog = () => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    size="lg"
                    // className="bg-pink-600  hover:bg-pink-700  text-white font-medium px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                    className="bg-main  hover:bg-amber-500  text-black font-medium px-8 py-6 text-lg rounded-md shadow-lg hover:shadow-xl transition-all duration-200"
                >
                    Enter Your Name to Begin
                    <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-screen">
                <DialogHeader>
                    <DialogTitle>Generate Chinese Name</DialogTitle>
                    <DialogDescription className="text-zinc-500 font-normal">
                        Please fill out the form below to generate a Chinese name.
                    </DialogDescription>
                </DialogHeader>
                <NameForm />
                <DialogFooter>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
export default FormDialog
