"use client";
import { z } from "zod";
import { Controller, FormProvider, useForm, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  password: z.string().min(4),
  email: z.string().email(),
});

type FormState = z.infer<typeof schema>;

const useLoginForm = () => {
  return useFormContext<FormState>();
};

const EmailInput = () => {
  const form = useLoginForm();
  return (
    <Controller
      control={form.control}
      name={"email"}
      render={({ field }) => {
        return (
          <div>
            <input {...field} />
            {form.formState.errors.email?.message && (
              <p className=" 에러인 경우 보여줄 UI ">{form.formState.errors.email?.message}</p>
            )}
          </div>
        );
      }}
    />
  );
};

const PasswordInput = () => {
  const form = useLoginForm();
  return (
    <Controller
      control={form.control}
      name="password"
      render={({ field }) => {
        return <input {...field} />;
      }}
    />
  );
};

const LoginForm = () => {
  const form = useForm<FormState>({ resolver: zodResolver(schema) });
  const handleSubmit = form.handleSubmit((data, e) => {
    e?.preventDefault();
    // 스키마를 통과못하면 제출이 안되기때문에 항상 유효한값으로 온다고 가정하고 짜면 됩니다.
    data.email;
    data.password;
  });
  return (
    <FormProvider {...form}>
      <EmailInput />
      <PasswordInput />
      {/* submit 타입인 버튼이 클릭되면 제출이 동작해요 */}
      <button type="submit">로그인</button>
    </FormProvider>
  );
};
