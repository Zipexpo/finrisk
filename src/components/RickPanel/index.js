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
      const { start_year, t } = formData;
      const sy = 0;
      const ey = formData.end_year - formData.start_year;
      const phi1 = jstat.normal.inv(1 / 100, 0, 1); // add control later
      const W_0 = init_amount;
      const vizdata = [
        {
          W_F: W_0 * (1 - u),
          E_WR: W_0,
          Q_WR: W_0,
          E: W_0,
          Q: W_0,
          a: [W_0, W_0],
          year: start_year,
          randW: W_0,
          pret: 0,
        },
      ];
      for (let i = sy + 1; i <= ey; i++) {
        const pret = t * (i / 50); // why 50?
        const W_F = 0; // 0 by now
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
          year: start_year + i,
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
        <CardDescription>If you wan to know about your risk in investment ^^.</CardDescription>
      </CardHeader>
      <CardContent className=" h-full relative flex-grow overflow-auto">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-x-2 gap-y-1 grid-cols-2 md:grid-cols-4"
          >
            <FormField
              control={form.control}
              name="start_year"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>Start Of Plan</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="end_year"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>End Of Plan</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="init_amount"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>W (0)</FormLabel>
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
                  <FormLabel>T</FormLabel>
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
                  <FormLabel>u</FormLabel>
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
                  <FormLabel>Risk free asset</FormLabel>
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
                  <FormLabel>Mu (μ)</FormLabel>
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
                  <FormLabel>Sigma (σ)</FormLabel>
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
        <div className="h-[300px]">
          <ReportRisk data={vizdata} />
        </div>
      </CardContent>
    </Card>
  );
}
