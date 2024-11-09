import React from "react";
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

const NationalIDForm = () => {
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

  const onSubmit = (data) => {
    console.log("Form submitted:", data);
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
                          <SelectItem value="M">Male</SelectItem>
                          <SelectItem value="F">Female</SelectItem>
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
                <Button
                  type="submit"
                  className="w-full bg-[#F78F1E] hover:bg-[#E67D0E] text-white"
                >
                  Submit
                </Button>
              </motion.div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NationalIDForm;
