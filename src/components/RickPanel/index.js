"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { riskSchema } from "../lib/schema";
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
import { fctGeoBrownMotion } from "../lib/utils";
import jstat from "jstat";

const defaultObject = {};
export default function RickPanel() {
  const form = useForm({
    resolver: zodResolver(riskSchema),
    mode: "onChange",
    // defaultValues: {r_},
  });
  const [formData, setFormData] = useState(defaultObject);
  const [vizdata, setVizdata] = useState([]);
  function onSubmit(data) {
    setFormData(data);
  }
  useEffect(() => {
    if (form.formState.isValid) {
      const init_amount = formData.init_amount;
      const mu = formData.mu / 100;
      const sigma = formData.sigma / 100;
      const u = formData.u / 100;
      const r_f = formData.r_f / 100;
      const a = formData.a / 100;
      const { t } = formData;
      const sy = 0;
      const ey = t;
      const phi1 = jstat.normal.inv(a, 0, 1); // add control later
      const W_0 = init_amount;
      const W_R = init_amount * u;
      const vizdata = [
        {
          W_F: W_0 * (1 - u),
          E_WR: W_R,
          Q_WR: W_R,
          E: W_0,
          Q: W_0,
          year: 0,
          randW: W_0,
          pret: 0,
        },
      ];
      for (let i = sy + 1; i <= 50; i++) {
        const pret = t * (i / 50); // why 50?
        const W_F = vizdata[0].W_F * Math.exp(r_f * pret); // 0 by now
        const E_WR = vizdata[0].E_WR * Math.exp(pret * mu);
        const Q_WR = fctGeoBrownMotion(vizdata[0].Q_WR, mu, sigma, pret, phi1);
        const E = E_WR + W_F;
        const Q = Q_WR + W_F;
        const randW =
          W_F +
          fctGeoBrownMotion(
            vizdata[i - 1].randW - vizdata[i - 1].W_F,
            mu,
            sigma,
            pret - vizdata[i - 1].pret,
            jstat.normal.inv(Math.random(), 0, 1)
          );
        debugger;
        vizdata.push({
          W_F,
          E_WR,
          Q_WR,
          E,
          Q,
          randW,
          pret,
          year: pret,
        });
      }
      console.log(vizdata);
      setVizdata(vizdata);
    }
  }, [formData, form.formState.isValid]);
  return (
    <Card className="w-full flex flex-col h-full">
      <CardHeader>
        <CardTitle className="flex justify-between">Risk explore</CardTitle>
        <CardDescription>
          If you wan to know about your risk in investment ^^.
        </CardDescription>
      </CardHeader>
      <CardContent className="h-full relative flex-grow overflow-auto">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-x-2 gap-y-1 grid-cols-2 md:grid-cols-4"
          >
            <FormField
              control={form.control}
              name="init_amount"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>Initial wealth (W(0))</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="t"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>Planing time in years (T)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="u"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>Percentage of Ricky Asset (u)</FormLabel>
                  <FormControl>
                    <Input type="number" subfix="%" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="r_f"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>Return of Risk-free asset (R_f)</FormLabel>
                  <FormControl>
                    <Input type="number" subfix="%" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mu"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>Expected return of Risky asset (μ)</FormLabel>
                  <FormControl>
                    <Input type="number" subfix="%" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sigma"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>Risk of Risky asset (σ)</FormLabel>
                  <FormControl>
                    <Input type="number" subfix="%" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="a"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>Confident</FormLabel>
                  <FormControl>
                    <Input type="number" subfix="%" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
        <div className="flex">
          <div className="w-2/3 h-[300px]">
            <ReportRisk data={vizdata} />
          </div>
          <div className="w-1/3 h-[300px]">
            <ReportRisk data={vizdata} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
