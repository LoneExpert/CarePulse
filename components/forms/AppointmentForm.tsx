"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
// import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

import { Doctors } from "@/constants";
import { createAppointment, updateAppointment } from "@/lib/actions/appointment.actions";
import { getAppointmentSchema } from "@/lib/validation";
import { Appointment } from "@/types/appwrite.types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import CustomFormField from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { SelectItem } from "../ui/select";
import { FormFieldTypes } from "./PatientForm";

const AppointmentForm = ({
  userId,
  patientId,
  type,
  appointment,
  setOpen
}: {
  userId: string;
  patientId: string;
  type: "create" | "schedule" | "cancel";
  appointment?: Appointment;
  setOpen: (open: boolean) => void;
}) => {
  const router = useRouter();

  const [isLoading, setisLoading] = useState(false);

  const AppointmentFormValidation = getAppointmentSchema(type);

  const form = useForm<z.infer<typeof AppointmentFormValidation>>({
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
      primaryPhysician: appointment ? appointment.primaryPhysician : '',
      schedule: appointment ? new Date(appointment?.schedule) : new Date(Date.now()),
      reason:appointment ? appointment?.reason : '',
      note: appointment?.note || '',
      cancellationReason: appointment?.cancellationReason || '',
    },          
  }); 

  // async function onSubmit(values: z.infer<typeof AppointmentFormValidation>) {
  //   console.log({type})
  //   setisLoading(true);

  //   let status;
  //   switch (type) {
  //       case 'schedule':
  //           status = 'scheduled';
  //           break;
  //       case 'cancel':
  //           status = 'cancelled';
  //           break;
  //       default:
  //           status = 'pending';
  //           break;
  //   }

  //   try {
  //       if(type === 'create' && patientId) {
  //           const appointmentData = {
  //               userId,
  //               patient:patientId,
  //               primaryPhysician: values.primaryPhysician,
  //               schedule: new Date(values.schedule),
  //               reason: values.reason!,
  //               note: values.note,
  //               status: status as Status,
  //           }
  //           const appointment = await createAppointment(appointmentData);

            
  //           if(appointment){
  //               form.reset();
  //               router.push(`/patients/${userId}/new-appointment/success?appointmentId=${appointment.$id}`)
  //           }
  //       }
  //       else{
  //           const appointmentToUpdate = {
  //               userId,
  //               appointmentId:appointment?.$id!,
  //               appointment:{
  //                   primaryPhysician: values?.primaryPhysician,
  //                   schedule: new Date(values?.schedule),
  //                   status: status as Status,
  //                   cancellationReason: values?.cancellationReason,
  //               },
  //               type,
  //           }
  //           const updatedAppointment = await updateAppointment(appointmentToUpdate);

  //           if(updatedAppointment){
  //               setOpen && setOpen(false);
  //               form.reset();
  //           }
  //       }
  //   } catch (error) {
  //     console.error(error);
  //   } 
    
  //   setisLoading(false);
    
  // }
  async function onSubmit(values: z.infer<typeof AppointmentFormValidation>) {
    console.log("Form submitted with values:", values);
    console.log("Appointment type:", type);
    
    setisLoading(true);
  
    let status;
    switch (type) {
      case 'schedule':
        status = 'scheduled';
        break;
      case 'cancel':
        status = 'cancelled';
        break;
      default:
        status = 'pending';
        break;
    }
  
    try {
      if (type === 'create' && patientId) {
        const appointmentData = {
          userId,
          patient: patientId,
          primaryPhysician: values.primaryPhysician,
          schedule: new Date(values.schedule),
          reason: values.reason!,
          note: values.note,
          status: status as Status,
        };
        console.log("Creating appointment:", appointmentData);
        const appointment = await createAppointment(appointmentData);
  
        if (appointment) {
          form.reset();
          console.log("Appointment created:", appointment);
          router.push(`/patients/${userId}/new-appointment/success?appointmentId=${appointment.$id}`);
        }
      } else {
        const appointmentToUpdate = {
          userId,
          appointmentId: appointment?.$id!,
          appointment: {
            primaryPhysician: values?.primaryPhysician,
            schedule: new Date(values?.schedule),
            status: status as Status,
            cancellationReason: values?.cancellationReason,
          },
          type,
        };
        console.log("Updating appointment:", appointmentToUpdate);
        const updatedAppointment = await updateAppointment(appointmentToUpdate);
  
        if (updatedAppointment) {
          console.log("Appointment updated:", updatedAppointment);
          setOpen && setOpen(false);
          form.reset();
        }
      }
    } catch (error) {
      console.error("Error in appointment flow:", error);
    }
  
    setisLoading(false);
  };
  


  let buttonLabel;
  switch (type) {
    case "cancel":
      buttonLabel = "Cancel Appointment";
      break;
    case "schedule":
      buttonLabel = "Schedule Appointment";
      break;
    default:
      buttonLabel = "Submit Apppointment";
  }



  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        {type==='create' && <section className="mb-12 space-y-4">
          <h1 className="header">New Appointment</h1>
          <p className="text-dark-700">
            Schedule an appointment in just a few clicks!.
          </p>
        </section>}

        {type !== "cancel" && (
          <>
            <CustomFormField
              fieldType={FormFieldTypes.SELECT}
              control={form.control}
              name="primaryPhysician"
              label="Doctor"
              placeholder="Select a doctor"
            >
              {Doctors.map((doctor) => (
                <SelectItem key={doctor.name} value={doctor.name}>
                  <div className="flex cursor-pointer items-center gap-2">
                    <Image
                      src={doctor.image}
                      width={32}
                      height={32}
                      alt={doctor.name}
                      className="rounded-full border border-dark-500"
                    />
                    <p>{doctor.name}</p>
                  </div>
                </SelectItem>
              ))} 
            </CustomFormField>

            <CustomFormField
              fieldType={FormFieldTypes.DATE_PICKER}
              control={form.control}
              name="schedule"
              label="Expected appointment date"
              showTimeSelect
              dateFormat="MM/dd/yyyy  -  h:mm aa"
            />
            
            <div className="flex flex-col gap-6 xl:flex-row">
              <CustomFormField
                fieldType={FormFieldTypes.TEXTAREA}
                control={form.control}
                name="reason"
                label="Reason for Appointment"
                placeholder="ex: I have a cold, I need a doctor's visit"
              />

              <CustomFormField
                fieldType={FormFieldTypes.TEXTAREA}
                control={form.control}
                name="note"
                label="Notes"
                placeholder="ex: I want to consult with Dr. Smith"
              />
            </div>
          </>
        )}

        {type === "cancel" && (
            <CustomFormField
                fieldType={FormFieldTypes.TEXTAREA}
                control={form.control}
                name="cancellationReason"
                label="Reason for Cancellation"
                placeholder="ex: I am unable to make it to my appointment"
            />
        )}

        <SubmitButton isLoading={isLoading} className={`${type === 'cancel' ? 'shad-danger-btn' : 'shad-primary-btn'} w-full`}>{buttonLabel}</SubmitButton>
      </form>
    </Form>
  );
};

export default AppointmentForm;
