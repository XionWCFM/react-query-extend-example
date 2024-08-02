"use client";
import * as z from "zod";
import { useForm, FormProvider, useFormContext, Controller, useController } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DevTool } from "@hookform/devtools";
import React, { ComponentProps, PropsWithChildren } from "react";

export default function Page() {
  return (
    <div className=" flex py-16 flex-col  justify-center items-center">
      <div className="">complex form</div>
      <div className=" h-4"></div>
      <ComplexFormProvider>
        <ComplexForm />
      </ComplexFormProvider>
    </div>
  );
}

const compleFormSchema = z.object({
  title: z.string().min(5),
  subTitle: z.string().min(2),
  content: z.string().min(10),
});

type ComplexFormType = z.infer<typeof compleFormSchema>;

const ComplexFormProvider = ({ children }: PropsWithChildren) => {
  const complexForm = useForm<ComplexFormType>({ resolver: zodResolver(compleFormSchema) });
  return <FormProvider {...complexForm}>{children}</FormProvider>;
};

const ComplexForm = () => {
  const { handleSubmit, register, control } = useFormContext<ComplexFormType>();

  return (
    <div className=" flex flex-col">
      {/* <DevTool control={control} /> */}
      <form
        onSubmit={handleSubmit(async (data) => {
          console.log(data);
        })}
        className=" flex flex-col justify-center items-center gap-y-4"
      >
        <ControlledInput name={"title"} />
        <ControlledInput name={"subTitle"} />
        <ControlledInput name={"content"} />

        <button>제출하기</button>
      </form>
    </div>
  );
};

const ControlledInput = ({ name }: { name: keyof ComplexFormType }) => {
  const { control } = useFormContext<ComplexFormType>();
  const { field } = useController({ name, control });
  return <input className="bg-slate-100" type="text" {...field} />;
};
