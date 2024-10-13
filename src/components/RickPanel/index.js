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
import { ReportHist } from "../ui/Report/ReportHist";

const defaultObject = {};
export default function RickPanel() {
  const form = useForm({
    resolver: zodResolver(riskSchema),
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
        const W_F = vizdata[0].W_F * Math.exp(r_f * pret);
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

      const W_FT = vizdata[0].W_F * Math.exp(r_f * t);
      const E_WRT = W_R * Math.exp(mu * t);
      const Q_WRT =
        W_R *
        Math.exp((mu - (sigma * sigma) / 2) * t + sigma * Math.sqrt(t) * phi1);
      const EWT = W_FT + E_WRT;
      const QWT = W_FT + Q_WRT;
      const beta = QWT / W_0;

      // histogram
      const hmin = beta;
      const hmax =
        (W_R *
          Math.exp(
            (mu - (sigma * sigma) / 2) * t + sigma * Math.sqrt(t) * -phi1
          ) +
          W_FT) /
        W_0;
      const breite = hmax - hmin;
      const klassen = 20;
      const klassenbreite = breite / (klassen - 1);
      const histdata = [];
      for (let i = 0; i <= 20; i++) {
        const x = beta + klassenbreite * i;
        const za =
          (Math.log((x + Math.exp(r_f * t) * (u - 1)) / u) -
            (mu - (sigma * sigma) / 2) * t) /
          (sigma * Math.sqrt(t));
        const _y = jstat.normal.cdf(za, 0, 1);
        const y = _y - (histdata[i - 1]?._y ?? 0);
        histdata.push({ x, y, _y });
      }
      setResult({ W_FT, E_WRT, Q_WRT, EWT, QWT, beta });
      setHistdata(histdata);

      setVizdata(vizdata);
    }
  }, [formData, form.formState.isValid]);
  const handleSim = (e) => {
    e.preventDefault();
    const mu = formData.mu / 100;
    const sigma = formData.sigma / 100;
    vizdata.forEach((d, i) => {
      debugger;
      d.randW = i
        ? d.W_F +
          fctGeoBrownMotion(
            vizdata[i - 1].randW - vizdata[i - 1].W_F,
            mu,
            sigma,
            d.pret - vizdata[i - 1].pret,
            jstat.normal.inv(Math.random(), 0, 1)
          )
        : formData.init_amount;
    });
    debugger;
    setVizdata([...vizdata]);
  };
  return (
    <Card className="w-full flex flex-col h-full">
      <CardHeader>
        <CardTitle className="flex justify-between">Risk explore</CardTitle>
        <CardDescription>
          If you want to know about your investment risks, fill the form below.
        </CardDescription>
      </CardHeader>
      <CardContent className="h-full relative flex-grow overflow-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="">
            <div className="grid gap-x-2 gap-y-1 grid-cols-2 md:grid-cols-4">
              <FormField
                control={form.control}
                name="init_amount"
                render={({ field }) => (
                  <FormItem className="col-span-2">
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
                    <FormLabel>Percentage of Risky Asset (u)</FormLabel>
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
            </div>
            <div className="flex justify-center gap-3">
              <Button type="submit">Submit</Button>
              <Button variant="outline" onClick={handleSim}>
                Simulation
              </Button>
            </div>
          </form>
        </Form>
        <div className="flex gap-2 mt-2">
          <div className="w-2/3 h-[300px]">
            <ReportRisk data={vizdata} />
          </div>
          <div className="w-1/3 h-[300px]">
            <ReportHist data={histdata} />
          </div>
        </div>
        {result && (
          <div className="mt-2 grid grid-cols-2">
            <div>
              Risk-free Asset accumulation:{" "}
              <div>
                W_F(T):{" "}
                <p className="ml-3 inline font-bold">
                  ${Math.round(result.W_FT)}
                </p>
              </div>
            </div>
            <div>
              Risky Asset accumulation:{" "}
              <div>
                E[W_R(T)]:{" "}
                <p className="text-blue-600 inline ml-3 font-bold">
                  ${Math.round(result.E_WRT)}
                </p>
              </div>
              <div>
                Q[W_R(T)]:{" "}
                <p className="text-red-600 inline ml-3 font-bold">
                  ${Math.round(result.Q_WRT)}
                </p>
              </div>
            </div>
            <div className="col-span-2">
              Accumulation:{" "}
              <div>
                E[W(T)]:{" "}
                <p className="text-blue-600 inline ml-3 font-bold">
                  ${Math.round(result.EWT)}
                </p>
              </div>
              <div>
                Q[W(T)]:{" "}
                <p className="text-red-600 inline ml-3 font-bold">
                  ${Math.round(result.QWT)}
                </p>
                <p className="inline ml-3">
                  ={">"} β:{" "}
                  <p className="inline ml-3 font-bold">
                    {Math.round(result.beta * 100) / 100}
                  </p>
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
