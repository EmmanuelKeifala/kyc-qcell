import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { removeLeadingZero } from "@/lib/utils";
import { toast } from "react-toastify";
import Loader from "../Loader";

const formSchema = z.object({
  surname: z
    .string()
    .min(1, "Surname is required")
    .regex(/^[A-Za-z]+$/, "Surname should contain only letters"),
  name: z
    .string()
    .min(1, "Name is required")
    .regex(/^[A-Za-z]+$/, "Name should contain only letters"),
  middleName: z
    .string()
    .regex(/^[A-Za-z]*$/, "Middle name should contain only letters"),
  sex: z.string().min(1, "Sex is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  height: z.string().regex(/^\d*\.?\d+$/, "Height must be a valid number"),
  personalIDNumber: z.string().min(1, "Personal ID number is required"),
  dateOfExpiry: z.string().min(1, "Date of expiry is required"),
});

const NationalIDForm = ({
  phoneNumber,
  onNext,
}: {
  phoneNumber: string;
  onNext: any;
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      surname: "",
      name: "",
      middleName: "",
      sex: "",
      dateOfBirth: "",
      height: "",
      personalIDNumber: "",
      dateOfExpiry: "",
    },
  });

  const onSubmit = async (formData: any) => {
    setLoading(true);
    try {
      const formattedNumber = removeLeadingZero(phoneNumber).startsWith("232")
        ? phoneNumber
        : "232" + removeLeadingZero(phoneNumber);

      const { data } = await supabase
        .from("verification_applicants")
        .select("id")
        .eq("phoneNumber", formattedNumber)
        .single();

      const { error: personalDetailError } = await supabase
        .from("verification_applicants")
        .update({ personal_detail: formData })
        .eq("id", data?.id);

      if (personalDetailError) {
        toast.error(personalDetailError?.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setLoading(false);
        return;
      }

      onNext();
    } catch (error) {
      console.log(error);
      toast.error("Something Went Wrong", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-6 bg-gray-50">
      <Card className="w-full max-w-2xl border-[#F78F1E]/20">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center text-[#F78F1E]">
            National ID Form
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="surname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Surname</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter surname" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="middleName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Middle Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter middle name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sex"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sex</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select sex" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="height"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Height (m)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="Enter height"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="personalIDNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Personal ID Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter ID number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dateOfExpiry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Expiry</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="pt-4"
              >
                {!loading ? (
                  <Button
                    type="submit"
                    className="bg-[#F78F1E] hover:bg-[#E67D0E] text-white w-full"
                  >
                    Submit
                  </Button>
                ) : (
                  <Loader />
                )}
              </motion.div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NationalIDForm;
