"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { retirementSchema } from "../lib/schema";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { ReportRisk } from "../ui/Report/ReportRisk";
import { useEffect, useMemo, useState } from "react";
import jstat from "jstat";
import { ReportRetirement } from "../ui/Report/ReportRetirement";

const defaultObject = {};
export default function RetirementPanel() {
  const form = useForm({
    resolver: zodResolver(retirementSchema),
    mode: "onChange",
    // defaultValues: {r_},
  });
  const [formData, setFormData] = useState(defaultObject);
  const [vizdata, setVizdata] = useState([]);
  const [histdata, setHistdata] = useState([]);
  const [result, setResult] = useState();
  function onSubmit(data) {
    setFormData(data);
  }
  useEffect(() => {
    if (form.formState.isValid && formData.acneed) {
      let { acneed, i, w_t, r_t, f } = formData;
      i = i / 100;
      f = f / 100;
      let tt = 0;
      const vizdata = [
        {
          cc: acneed,
          cb: 0,
          year: 0,
        },
      ];
      for (let t_i = 0; t_i < r_t - 1; t_i++) {
        const pre = vizdata[tt];
        tt++;
        let cb = pre.cc / (1 + i - f);
        let cc = cb + acneed;
        vizdata.push({
          cc,
          cb,
          year: tt,
        });
      }
      let x =
        vizdata[tt].cc / (1 + i - f) / sumGeometricSeries(1 + i - f, w_t - 1);
      for (let t_i = 0; t_i < w_t; t_i++) {
        const pre = vizdata[tt];
        tt++;
        let cb = pre.cc / (1 + i - f);
        let cc = cb - x;
        vizdata.push({
          cc,
          cb,
          year: tt,
          isSaving: true,
        });
      }
      vizdata.forEach((d) => (d.year = tt - d.year));
      setResult({ saving: x });
      // setHistdata(histdata);
      setVizdata(vizdata.filter(d=>!d.isSaving));
    }
  }, [formData, form.formState.isValid]);
  return (
    <Card className="w-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex justify-between">
          Retirement withdraw
        </CardTitle>
        <CardDescription>Retirement.</CardDescription>
      </CardHeader>
      <CardContent className="relative flex-grow overflow-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="">
            <div className="grid gap-x-2 gap-y-1 grid-cols-2 md:grid-cols-3">
              <FormField
                control={form.control}
                name="acneed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount needed for retirement</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="w_t"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel>Number of years until retirement</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="r_t"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel>Number of years in retirement</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="i"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel>Interest Rate</FormLabel>
                    <FormControl>
                      <Input type="number" subfix="%" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="f"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel>Inflation</FormLabel>
                    <FormControl>
                      <Input type="number" subfix="%" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-center items-end">
                <Button type="submit">Submit</Button>
              </div>
            </div>
          </form>
        </Form>
        {result && (
          <div className=" mt-5">
            Required Saving Amount yearly:
            <p className="text-red-600 inline ml-3 font-bold">
              ${Math.round(result.saving)}
            </p>
          </div>
        )}
        <div className="h-[300px] mt-5">
          <ReportRetirement data={vizdata} />
        </div>
      </CardContent>
    </Card>
  );
}

function sumGeometricSeries(a, t) {
  if (a === 1) {
    return t + 1; // Special case when a = 1
  } else {
    return (1 - Math.pow(a, t + 1)) / (1 - a); // General case for a ≠ 1
  }
}
