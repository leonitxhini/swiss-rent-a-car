import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Car, useCreateBooking } from "@workspace/api-client-react";
import { Button, Input, Label, Dialog } from "./ui-core";
import { X, Calendar, MapPin, User, Mail, Phone, CheckCircle2 } from "lucide-react";

const bookingSchema = z.object({
  pickupDate: z.string().min(1, "Data e pranimit kërkohet"),
  returnDate: z.string().min(1, "Data e dorëzimit kërkohet"),
  pickupLocation: z.string().min(2, "Lokacioni kërkohet"),
  firstName: z.string().min(2, "Emri kërkohet"),
  lastName: z.string().min(2, "Mbiemri kërkohet"),
  email: z.string().email("Email i pasaktë"),
  phone: z.string().min(6, "Numri i telefonit kërkohet"),
  driverAge: z.coerce.number().min(18, "Mosha minimale është 18").max(99, "Mosha maksimale është 99"),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

interface BookingModalProps {
  car: Car | null;
  onClose: () => void;
}

export function BookingModal({ car, onClose }: BookingModalProps) {
  const [successCode, setSuccessCode] = useState<string | null>(null);
  
  const { register, handleSubmit, formState: { errors } } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      pickupLocation: "Aeroporti i Prishtinës",
      driverAge: 25,
    }
  });

  const { mutate: createBooking, isPending } = useCreateBooking({
    mutation: {
      onSuccess: (data) => {
        setSuccessCode(data.confirmationCode);
      }
    }
  });

  const onSubmit = (data: BookingFormValues) => {
    if (!car) return;
    createBooking({
      data: {
        ...data,
        carId: car.id,
        // Ensure ISO format for backend if necessary, or just send date string
        pickupDate: new Date(data.pickupDate).toISOString(),
        returnDate: new Date(data.returnDate).toISOString(),
      }
    });
  };

  if (!car) return null;

  return (
    <Dialog open={!!car} onOpenChange={onClose}>
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 p-2 rounded-full hover:bg-muted transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      {successCode ? (
        <div className="text-center py-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold mb-2">Rezervimi i Suksesshëm!</h2>
          <p className="text-muted-foreground mb-8">Faleminderit që zgjodhët Swiss Rent A Car.</p>
          
          <div className="bg-muted rounded-xl p-6 mb-8">
            <p className="text-sm font-medium text-muted-foreground mb-1">Kodi i Rezervimit:</p>
            <p className="text-2xl font-mono font-bold tracking-wider text-primary">{successCode}</p>
          </div>
          
          <Button onClick={onClose} className="w-full">Mbyll</Button>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Rezervo {car.brand} {car.model}</h2>
            <p className="text-muted-foreground mt-1">Plotësoni të dhënat për të përfunduar rezervimin.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2 border-b pb-2">
                <Calendar className="w-5 h-5 text-primary" /> Detajet e Qirasë
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Data e Pranimit</Label>
                  <Input type="date" {...register("pickupDate")} />
                  {errors.pickupDate && <p className="text-destructive text-xs">{errors.pickupDate.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Data e Dorëzimit</Label>
                  <Input type="date" {...register("returnDate")} />
                  {errors.returnDate && <p className="text-destructive text-xs">{errors.returnDate.message}</p>}
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Lokacioni</Label>
                  <Input placeholder="P.sh. Aeroporti..." {...register("pickupLocation")} />
                  {errors.pickupLocation && <p className="text-destructive text-xs">{errors.pickupLocation.message}</p>}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2 border-b pb-2">
                <User className="w-5 h-5 text-primary" /> Të Dhënat Personale
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Emri</Label>
                  <Input placeholder="Emri juaj" {...register("firstName")} />
                  {errors.firstName && <p className="text-destructive text-xs">{errors.firstName.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Mbiemri</Label>
                  <Input placeholder="Mbiemri juaj" {...register("lastName")} />
                  {errors.lastName && <p className="text-destructive text-xs">{errors.lastName.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" placeholder="email@shembull.com" {...register("email")} />
                  {errors.email && <p className="text-destructive text-xs">{errors.email.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Telefoni</Label>
                  <Input placeholder="+383 4x xxx xxx" {...register("phone")} />
                  {errors.phone && <p className="text-destructive text-xs">{errors.phone.message}</p>}
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Mosha e Shoferit</Label>
                  <Input type="number" {...register("driverAge")} />
                  {errors.driverAge && <p className="text-destructive text-xs">{errors.driverAge.message}</p>}
                </div>
              </div>
            </div>

            <div className="bg-primary/5 p-4 rounded-xl flex items-center justify-between border border-primary/20">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Çmimi ditor</p>
                <p className="text-2xl font-bold text-foreground">€{car.pricePerDay}</p>
              </div>
              <Button type="submit" disabled={isPending} className="px-8">
                {isPending ? "Po Rezervohet..." : "Konfirmo Rezervimin"}
              </Button>
            </div>
          </form>
        </>
      )}
    </Dialog>
  );
}
