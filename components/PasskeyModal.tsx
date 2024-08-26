"use client";

import React, { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { decryptKey, encryptKey } from "@/lib/utils";

const PasskeyModal = () => {
  const router = useRouter();
  const path = usePathname();
  const [open, setopen] = useState(true);
  const [passkey, setpasskey] = useState('');
  const [error, seterror] = useState('');

  const encryptedKey = typeof window !== 'undefined' ? window.localStorage.getItem('admin') : null;

  useEffect(() => {

    const accesskey = encryptedKey && decryptKey(encryptedKey);

    if(path){
        if(accesskey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY){
            setopen(false);
            router.push("/admin");
        }
        else{
            setopen(true);
        }
    }
  }, [encryptedKey])
  

  const validatePasskey = (e : React.MouseEvent<HTMLButtonElement, MouseEvent>) =>{
    e.preventDefault();
    if(passkey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY){
        const encryptedKey = encryptKey(passkey);
        localStorage.setItem('admin', encryptedKey);
        setopen(false);
    }
    else{
        seterror('Invalid Passkey. Please try again.');
    }
  }

  const closeModal = () => {
    setopen(false);
    router.push("/");
  };

  return (
    <AlertDialog open={open} onOpenChange={setopen}>
      <AlertDialogContent className="shad-alert-dialog">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-start justify-between">
            Admin Access Verification
            <Image
              src="/assets/icons/close.svg"
              alt="close"
              width={20}
              height={20}
              onClick={() => closeModal()}
              className="cursor-pointer"
            />
          </AlertDialogTitle>
          <AlertDialogDescription>
            To access the admin page, please enter the passkey
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div>
          <InputOTP maxLength={6} value={passkey} onChange={(value)=>setpasskey(value)}>
            <InputOTPGroup className="shad-otp">
              <InputOTPSlot className="shad-otp-slot" index={0} />
              <InputOTPSlot className="shad-otp-slot" index={1} />
              <InputOTPSlot className="shad-otp-slot" index={2} />
              <InputOTPSlot className="shad-otp-slot" index={3} />
              <InputOTPSlot className="shad-otp-slot" index={4} />
              <InputOTPSlot className="shad-otp-slot" index={5} />
            </InputOTPGroup>
          </InputOTP>
        
            {error && <p className="shad-error text-14-regular mt-4 flex justify-center">
                {error}    
            </p>}

        </div>
        <AlertDialogFooter>
          <AlertDialogAction onClick={(e)=>validatePasskey(e)}
            className="shad-primary-btn w-full"
            >
            Enter Admin Passkey
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PasskeyModal;
