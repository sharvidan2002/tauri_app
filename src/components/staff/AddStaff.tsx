import React, { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  User,
  Briefcase,
  DollarSign,
  Camera,
  Calendar as CalendarIcon,
  Save,
  RefreshCcw,
  AlertCircle,
} from "lucide-react";
import { Staff, StaffFormData, DEFAULT_STAFF } from "@/types/staff";
import {
  DESIGNATIONS,
  SALARY_CODES,
  MARITAL_STATUSES,
  GENDERS,
} from "@/lib/constants";
import { useAddStaff } from "@/hooks/useStaff";
import { useImageCrop } from "@/hooks/useImageCrop";
import {
  calculateAge,
  calculateRetirementDate,
  autoFormatIncrementDate,
  formatDateForInput,
  convertInputDateToDisplay,
} from "@/lib/dateUtils";
import {
  convertOldToNewNIC,
  getGenderFromNIC,
  getAgeFromNIC,
  getFormattedBirthDateFromNIC,
} from "@/lib/nicConverter";
import ImageCropper from "./ImageCropper";
const AddStaff: React.FC = () => {
  const [formData, setFormData] = useState<StaffFormData>({
    ...DEFAULT_STAFF,
    appointmentNumber: "",
    fullName: "",
    dateOfBirth: "",
    age: 0,
    nicNumber: "",
    addressLine1: "",
    contactNumber: "",
    designation: "" as any,
    dateOfFirstAppointment: "",
    dateOfRetirement: "",
    incrementDate: "",
    salaryCode: "" as any,
    basicSalary: 0,
    incrementAmount: 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDatePickerOpen, setIsDatePickerOpen] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const addStaff = useAddStaff();
  const imageCrop = useImageCrop();
  const validateField = useCallback(
    (name: string, value: any) => {
      const newErrors = { ...errors };
      switch (name) {
        case "appointmentNumber":
          if (!value.trim()) {
            newErrors[name] = "Appointment number is required";
          } else if (value.length < 3) {
            newErrors[name] =
              "Appointment number must be at least 3 characters";
          } else {
            delete newErrors[name];
          }
          break;
        case "fullName":
          if (!value.trim()) {
            newErrors[name] = "Full name is required";
          } else if (value.length < 2) {
            newErrors[name] = "Full name must be at least 2 characters";
          } else {
            delete newErrors[name];
          }
          break;
        case "nicNumber":
          if (!value.trim()) {
            newErrors[name] = "NIC number is required";
          } else {
            try {
              const newNIC = convertOldToNewNIC(value);
              if (newNIC) {
                delete newErrors[name];
              }
            } catch (error) {
              newErrors[name] = "Invalid NIC number format";
            }
          }
          break;
        case "contactNumber":
          if (!value.trim()) {
            newErrors[name] = "Contact number is required";
          } else if (!/^(\+94|0)?[0-9]{9}$/.test(value)) {
            newErrors[name] = "Invalid Sri Lankan phone number format";
          } else {
            delete newErrors[name];
          }
          break;
        case "email":
          if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            newErrors[name] = "Invalid email format";
          } else {
            delete newErrors[name];
          }
          break;
        case "dateOfBirth":
        case "dateOfFirstAppointment":
          if (!value.trim()) {
            newErrors[name] = "Date is required";
          } else {
            delete newErrors[name];
          }
          break;
        case "incrementDate":
          if (!value.trim()) {
            newErrors[name] = "Increment date is required";
          } else if (!/^\d{2}-\d{2}$/.test(value)) {
            newErrors[name] = "Format must be dd-MM";
          } else {
            delete newErrors[name];
          }
          break;
        case "basicSalary":
        case "incrementAmount":
          if (value < 0) {
            newErrors[name] = "Amount must be positive";
          } else {
            delete newErrors[name];
          }
          break;
        default:
          if (!value || (typeof value === "string" && !value.trim())) {
            newErrors[name] = "This field is required";
          } else {
            delete newErrors[name];
          }
      }
      setErrors(newErrors);
    },
    [errors]
  );
  const handleInputChange = useCallback(
    (name: string, value: any) => {
      setFormData((prev) => {
        const newData = { ...prev, [name]: value };
        // Auto-calculate fields based on changes
        if (name === "nicNumber" && value) {
          try {
            const convertedNIC = convertOldToNewNIC(value);
            const gender = getGenderFromNIC(value);
            const age = getAgeFromNIC(value);
            const birthDate = getFormattedBirthDateFromNIC(value);
            if (gender) newData.gender = gender as "Male" | "Female";
            if (age > 0) newData.age = age;
            if (birthDate) {
              newData.dateOfBirth = birthDate;
              newData.dateOfRetirement = calculateRetirementDate(birthDate);
            }
            newData.nicNumber = convertedNIC;
          } catch (error) {
            console.error("NIC conversion error:", error);
          }
        }
        if (name === "dateOfBirth" && value) {
          const displayDate = convertInputDateToDisplay(value);
          newData.dateOfBirth = displayDate;
          newData.age = calculateAge(displayDate);
          newData.dateOfRetirement = calculateRetirementDate(displayDate);
        }
        if (name === "dateOfFirstAppointment" && value) {
          newData.dateOfFirstAppointment = convertInputDateToDisplay(value);
        }
        if (name === "incrementDate" && value) {
          newData.incrementDate = autoFormatIncrementDate(value);
        }
        return newData;
      });
      validateField(name, value);
    },
    [validateField]
  );
  const handleImageUpload = useCallback(
    (file: File) => {
      setSelectedImage(file);
      imageCrop.openCropDialog(file);
    },
    [imageCrop]
  );
  const handleImageCropped = useCallback((croppedFile: File) => {
    setSelectedImage(croppedFile);
    setFormData((prev) => ({
      ...prev,
      imagePath: URL.createObjectURL(croppedFile),
    }));
  }, []);
  const resetForm = useCallback(() => {
    setFormData({
      ...DEFAULT_STAFF,
      appointmentNumber: "",
      fullName: "",
      dateOfBirth: "",
      age: 0,
      nicNumber: "",
      addressLine1: "",
      contactNumber: "",
      designation: "" as any,
      dateOfFirstAppointment: "",
      dateOfRetirement: "",
      incrementDate: "",
      salaryCode: "" as any,
      basicSalary: 0,
      incrementAmount: 0,
    });
    setErrors({});
    setSelectedImage(null);
    setIsDatePickerOpen(null);
  }, []);
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      // Validate all fields
      Object.keys(formData).forEach((key) => {
        validateField(key, formData[key as keyof StaffFormData]);
      });
      if (Object.keys(errors).length > 0) {
        return;
      }
      const staffData: Staff = {
        ...formData,
        imageFile: selectedImage || undefined,
      };
      try {
        await addStaff.mutateAsync(staffData);
        resetForm();
        // Show success message
      } catch (error) {
        console.error("Error adding staff:", error);
        // Show error message
      }
    },
    [formData, errors, selectedImage, addStaff, validateField, resetForm]
  );
  const renderFormSection = (
    title: string,
    icon: React.ReactNode,
    children: React.ReactNode
  ) => (
    <div className="form-section">
      <h3 className="form-section-title flex items-center gap-2">
        {icon}
        {title}
      </h3>
      {children}
    </div>
  );
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <User className="h-6 w-6" />
            Add New Staff Member
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload Section */}
            {renderFormSection(
              "Staff Photo",
              <Camera className="h-5 w-5" />,
              <ImageCropper
                onImageSelect={handleImageUpload}
                onImageCropped={handleImageCropped}
                selectedImage={selectedImage}
                className="mb-4"
              />
            )}
            {/* Personal Details Section */}
            {renderFormSection(
              "Identification & Personal Details",
              <User className="h-5 w-5" />,
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="appointmentNumber" variant="required">
                    Appointment Number
                  </Label>
                  <Input
                    id="appointmentNumber"
                    value={formData.appointmentNumber}
                    onChange={(e) =>
                      handleInputChange("appointmentNumber", e.target.value)
                    }
                    error={!!errors.appointmentNumber}
                    placeholder="Enter appointment number"
                  />
                  {errors.appointmentNumber && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.appointmentNumber}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fullName" variant="required">
                    Full Name
                  </Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) =>
                      handleInputChange("fullName", e.target.value)
                    }
                    error={!!errors.fullName}
                    placeholder="Enter full name"
                  />
                  {errors.fullName && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.fullName}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender" variant="required">
                    Gender
                  </Label>
                  <div className="flex items-center space-x-6">
                    {GENDERS.map((gender) => (
                      <div
                        key={gender.value}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={gender.value}
                          checked={formData.gender === gender.value}
                          onCheckedChange={() =>
                            handleInputChange("gender", gender.value)
                          }
                        />
                        <Label htmlFor={gender.value}>{gender.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth" variant="required">
                    Date of Birth
                  </Label>
                  <Dialog
                    open={isDatePickerOpen === "dateOfBirth"}
                    onOpenChange={(open) =>
                      setIsDatePickerOpen(open ? "dateOfBirth" : null)
                    }
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.dateOfBirth || "Select date of birth"}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Select Date of Birth</DialogTitle>
                      </DialogHeader>
                      <Calendar
                        mode="single"
                        onSelect={(date) => {
                          if (date) {
                            handleInputChange(
                              "dateOfBirth",
                              formatDateForInput(date)
                            );
                            setIsDatePickerOpen(null);
                          }
                        }}
                        disabled={(date) => date > new Date()}
                        className="rounded-md border"
                      />
                    </DialogContent>
                  </Dialog>
                  {errors.dateOfBirth && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.dateOfBirth}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Age</Label>
                  <Input
                    value={`${formData.age} years`}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nicNumber" variant="required">
                    NIC Number
                  </Label>
                  <Input
                    id="nicNumber"
                    value={formData.nicNumber}
                    onChange={(e) =>
                      handleInputChange(
                        "nicNumber",
                        e.target.value.toUpperCase()
                      )
                    }
                    error={!!errors.nicNumber}
                    placeholder="Enter NIC number"
                  />
                  {errors.nicNumber && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.nicNumber}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maritalStatus" variant="required">
                    Marital Status
                  </Label>
                  <Select
                    value={formData.maritalStatus}
                    onValueChange={(value) =>
                      handleInputChange("maritalStatus", value)
                    }
                  >
                    <SelectTrigger error={!!errors.maritalStatus}>
                      <SelectValue placeholder="Select marital status" />
                    </SelectTrigger>
                    <SelectContent>
                      {MARITAL_STATUSES.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="addressLine1" variant="required">
                    Address Line 1
                  </Label>
                  <Input
                    id="addressLine1"
                    value={formData.addressLine1}
                    onChange={(e) =>
                      handleInputChange("addressLine1", e.target.value)
                    }
                    error={!!errors.addressLine1}
                    placeholder="Street address"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="addressLine2">Address Line 2</Label>
                  <Input
                    id="addressLine2"
                    value={formData.addressLine2 || ""}
                    onChange={(e) =>
                      handleInputChange("addressLine2", e.target.value)
                    }
                    placeholder="Apartment, suite, etc."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="addressLine3">Address Line 3</Label>
                  <Input
                    id="addressLine3"
                    value={formData.addressLine3 || ""}
                    onChange={(e) =>
                      handleInputChange("addressLine3", e.target.value)
                    }
                    placeholder="City, postal code"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactNumber" variant="required">
                    Contact Number
                  </Label>
                  <Input
                    id="contactNumber"
                    value={formData.contactNumber}
                    onChange={(e) =>
                      handleInputChange("contactNumber", e.target.value)
                    }
                    error={!!errors.contactNumber}
                    placeholder="07XXXXXXXX"
                  />
                  {errors.contactNumber && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.contactNumber}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email || ""}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    error={!!errors.email}
                    placeholder="email@example.com"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>
            )}
            {/* Employment Details Section */}
            {renderFormSection(
              "Employment Details",
              <Briefcase className="h-5 w-5" />,
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="designation" variant="required">
                    Designation
                  </Label>
                  <Select
                    value={formData.designation}
                    onValueChange={(value) =>
                      handleInputChange("designation", value)
                    }
                  >
                    <SelectTrigger error={!!errors.designation}>
                      <SelectValue placeholder="Select designation" />
                    </SelectTrigger>
                    <SelectContent>
                      {DESIGNATIONS.map((designation) => (
                        <SelectItem
                          key={designation.value}
                          value={designation.value}
                        >
                          {designation.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfFirstAppointment" variant="required">
                    Date of First Appointment
                  </Label>
                  <Dialog
                    open={isDatePickerOpen === "dateOfFirstAppointment"}
                    onOpenChange={(open) =>
                      setIsDatePickerOpen(
                        open ? "dateOfFirstAppointment" : null
                      )
                    }
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.dateOfFirstAppointment ||
                          "Select appointment date"}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Select First Appointment Date</DialogTitle>
                      </DialogHeader>
                      <Calendar
                        mode="single"
                        onSelect={(date) => {
                          if (date) {
                            handleInputChange(
                              "dateOfFirstAppointment",
                              formatDateForInput(date)
                            );
                            setIsDatePickerOpen(null);
                          }
                        }}
                        disabled={(date) => date > new Date()}
                        className="rounded-md border"
                      />
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="space-y-2">
                  <Label>Date of Retirement</Label>
                  <Input
                    value={formData.dateOfRetirement || "Auto-calculated"}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="incrementDate" variant="required">
                    Increment Date (dd-MM)
                  </Label>
                  <Input
                    id="incrementDate"
                    value={formData.incrementDate}
                    onChange={(e) =>
                      handleInputChange("incrementDate", e.target.value)
                    }
                    error={!!errors.incrementDate}
                    placeholder="DD-MM"
                    maxLength={5}
                  />
                  {errors.incrementDate && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.incrementDate}
                    </p>
                  )}
                </div>
              </div>
            )}
            {/* Salary Information Section */}
            {renderFormSection(
              "Salary Information",
              <DollarSign className="h-5 w-5" />,
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="salaryCode" variant="required">
                    Salary Code
                  </Label>
                  <Select
                    value={formData.salaryCode}
                    onValueChange={(value) =>
                      handleInputChange("salaryCode", value)
                    }
                  >
                    <SelectTrigger error={!!errors.salaryCode}>
                      <SelectValue placeholder="Select salary code" />
                    </SelectTrigger>
                    <SelectContent>
                      {SALARY_CODES.map((code) => (
                        <SelectItem key={code.value} value={code.value}>
                          {code.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="basicSalary" variant="required">
                    Basic Salary (Rs.)
                  </Label>
                  <Input
                    id="basicSalary"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.basicSalary}
                    onChange={(e) =>
                      handleInputChange(
                        "basicSalary",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    error={!!errors.basicSalary}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="incrementAmount" variant="required">
                    Increment Amount (Rs.)
                  </Label>
                  <Input
                    id="incrementAmount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.incrementAmount}
                    onChange={(e) =>
                      handleInputChange(
                        "incrementAmount",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    error={!!errors.incrementAmount}
                    placeholder="0.00"
                  />
                </div>
              </div>
            )}
            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                disabled={addStaff.isPending}
              >
                <RefreshCcw className="h-4 w-4 mr-2" />
                Reset Form
              </Button>
              <Button
                type="submit"
                loading={addStaff.isPending}
                disabled={Object.keys(errors).length > 0}
              >
                <Save className="h-4 w-4 mr-2" />
                Add Staff Member
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
export default AddStaff;