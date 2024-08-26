"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
// import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

import CustomFormField from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { useState } from "react";
import { UserFormValidation } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { createUser } from "@/lib/actions/patient.actions";

export enum FormFieldTypes {
    INPUT = 'input',
    TEXTAREA = 'textarea',
    PHONE_INPUT = 'phoneinput',
    CHECKBOX = 'checkbox',
    DATE_PICKER = 'datepicker',
    SELECT = 'select',
    SKELETON = 'skeleton',
}


const PatientForm = () => {

    const router = useRouter();

    const [isLoading, setisLoading] = useState(false);

  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  async function onSubmit({ name, email, phone }: z.infer<typeof UserFormValidation>) {
    setisLoading(true);

    try {
        const userData = { name, email, phone };
        console.log("User data being submitted:", userData);

        const user = await createUser(userData);
        console.log("User created:", user);

        if (user && user.$id) {
            console.log("Redirecting to:", `/patients/${user.$id}/register`);
            router.push(`/patients/${user.$id}/register`);
        } else {
            console.error("User creation failed or $id is missing.");
        }
    } catch (error) {
        console.error("Error creating user:", error);
    } finally {
        setisLoading(false);
    }
}


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <section className="mb-12 space-y-4">
          <h1 className="header">Hi there 👋</h1>
          <p className="text-dark-700">Schedule your first appointment.</p>
        </section>

        <CustomFormField 
            fieldType={FormFieldTypes.INPUT}
            control={form.control} 
            name="name"
            label="Full Name"
            placeholder="Saumya"
            iconSrc="/assets/icons/user.svg"
            iconAlt="user"
        />

        <CustomFormField 
            fieldType={FormFieldTypes.INPUT}
            control={form.control} 
            name="email"
            label="Email"
            placeholder="saumya@gmail.com"
            iconSrc="/assets/icons/email.svg"
            iconAlt="email"
        />

        <CustomFormField 
            fieldType={FormFieldTypes.PHONE_INPUT}
            control={form.control} 
            name="phone"
            label="Phone Number"
            placeholder="(555) 123-6789"
        />

        <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
      </form>
    </Form>
  );
};

export default PatientForm;
