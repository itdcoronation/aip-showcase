import { VehicleLookupResponse } from "@/types/insurance";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

export const fetchVehicleInfoService = async (
  license_number: string,
): Promise<VehicleLookupResponse> => {
  try {
    const response = await axios.get<VehicleLookupResponse>(
      "/api/insurance/vehicle-lookup",
      { params: { license_number } },
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching vehicle information:", error);
    return Promise.reject(error);
  }
};

export const useLookupVehicle = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: VehicleLookupResponse) => void;
  onError?: (error: AxiosError<unknown>) => void;
} = {}) => {
  return useMutation({
    mutationFn: fetchVehicleInfoService,
    onSuccess,
    onError,
    mutationKey: ["lookup-vehicle"],
  });
};
