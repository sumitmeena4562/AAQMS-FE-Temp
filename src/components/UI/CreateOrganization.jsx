import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, X, AlignLeft } from 'lucide-react';
import InputField from './InputField';
import SelectField from './SelectField';
import ImageUploadCard from './ImageUploadCard';

const BuildingIcon = () => (
  <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const CreateButtonIcon = () => (
  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m-9 0v-5a1 1 0 011-1h2a1 1 0 011 1v5m4 0h4" />
  </svg>
);

const ImageIconIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const orgSchema = z.object({
  name: z.string().min(3, "Name of Organization is required"),
  industry: z.string().min(1, "Industry Type is required"),
  occupancyType: z.string().min(1, "Occupancy Type is required"),
  classification: z.string().min(1, "Classification of Occupancy is required"),
  contactPerson: z.string().min(1, "Contact Person Name is required"),
  contactEmail: z.string().min(1, "Contact Email is required").email("Invalid email"),
  address: z.string().min(3, "Full address is required"),
  otherInfo: z.string().optional(),
  imagery: z.object({
    north: z.string().min(1, "Upload an image"),
    south: z.string().min(1, "Upload an image"),
    east: z.string().min(1, "Upload an image"),
    west: z.string().min(1, "Upload an image"),
    profile: z.string().min(1, "Upload an image"),
    extra: z.array(z.string().min(1, "Upload an image")).optional()
  })
});

const CreateOrganization = ({ onSubmit, onClose }) => {
  const { register, handleSubmit, formState: { errors, isValid }, setValue, watch, trigger } = useForm({
    resolver: zodResolver(orgSchema),
    mode: "all",
    defaultValues: {
      name: '',
      industry: 'Manufacturing & Heavy Industry',
      occupancyType: 'Industrial Factory',
      classification: 'Group H - High Hazard',
      contactPerson: '',
      contactEmail: '',
      address: '',
      otherInfo: '',
      imagery: {
        north: '',
        south: '',
        east: '',
        west: '',
        profile: '',
        extra: []
      }
    }
  });

  const imageryValues = watch('imagery');
  const nameValue = watch('name');
  const extraImages = imageryValues?.extra || [];

  const handleImage = (view, url) => {
    setValue(`imagery.${view}`, url, { shouldValidate: true, shouldDirty: true });
  };

  const submitForm = (data) => {
    if (onSubmit) {
      onSubmit({
        id: String(Date.now()),
        ...data,
        status: "ACTIVE",
        lastInventoryAudit: new Date().toISOString(),
        stats: { sites: 0, floors: 0, zones: 0 }
      });
    }
  };

  const isNameValid = nameValue?.trim()?.length > 0 && !errors.name;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#0a1128]/60 p-4 sm:p-6 backdrop-blur-md !p-45">
      <div
        className="w-full bg-white rounded-[16px] shadow-2xl flex flex-col mx-auto max-h-[95vh] overflow-y-auto !p-5"
        style={{ maxWidth: '800px' }}
      >
        <div className="p-8">
          {/* Header Section */}
          <div className="flex flex-col mb-8 p-1">
            <div className="flex flex-row items-center justify-between pb-4 border-b border-gray-100 !mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 !mb-1">
                  <BuildingIcon />
                </div>
                <h2 className="text-[22px] font-bold text-gray-900 leading-none">Create Organization</h2>
              </div>
              {onClose && (
                <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-700 transition">
                  <X size={24} />
                </button>
              )}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(submitForm)} className="flex flex-col">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-[32px] gap-y-[24px] mb-8 !p-1">
              <InputField
                label="Name of Organization"
                required
                placeholder="Apex Global Solutions"
                {...register("name")}
                error={errors.name?.message}
                isValid={isNameValid}
              />
              <SelectField
                label="Industry Type"
                {...register("industry")}
                error={errors.industry?.message}
                options={[
                  "Manufacturing & Heavy Industry",
                  "Construction",
                  "Healthcare",
                  "Education"
                ]}
              />

              <SelectField
                label="Occupancy Type"
                {...register("occupancyType")}
                error={errors.occupancyType?.message}
                options={[
                  "Industrial Factory",
                  "Commercial Building",
                  "Warehouse"
                ]}
              />
              <SelectField
                label="Classification of Occupancy"
                {...register("classification")}
                error={errors.classification?.message}
                options={[
                  "Group H - High Hazard",
                  "Group B - Business",
                  "Group S - Storage"
                ]}
              />

              <InputField
                label="Contact Person Name"
                placeholder="John Doe"
                required
                {...register("contactPerson")}
                error={errors.contactPerson?.message}
              />
              <InputField
                label="Contact Email"
                type="email"
                placeholder="email@company.com"
                required
                {...register("contactEmail")}
                error={errors.contactEmail?.message}
              />

              <InputField
                label="Full address"
                placeholder="address"
                required
                {...register("address")}
                error={errors.address?.message}
              />
              <InputField
                label="Other Information (Option)"
                placeholder="----"
                {...register("otherInfo")}
              />
            </div>

            {/* Site Imagery Section */}
            <div className="mt-8 mb-6 p-1">
              <div className="flex items-center justify-between mb-6 border-b border-gray-100 !pb-3 !pt-3">
                <div className="flex items-center gap-3">
                  <h3 className="text-[15px] font-bold text-gray-900">Site Imagery</h3>
                  <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-[4px] uppercase tracking-wider">Required</span>
                </div>
                <button
                  type="button"
                  onClick={() => setValue('imagery.extra', [...extraImages, ''], { shouldValidate: false, shouldDirty: true })}
                  className="bg-[#0F172A] hover:bg-gray-800 text-white rounded-[6px] px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Plus size={14} strokeWidth={2.5} />
                  Add More
                </button>
              </div>

              {/* Upload Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-[24px] !pt-2">
                <ImageUploadCard label="North View ↑" value={imageryValues?.north} onUpload={(url) => handleImage('north', url)} error={errors.imagery?.north?.message} />
                <ImageUploadCard label="South View ↓" value={imageryValues?.south} onUpload={(url) => handleImage('south', url)} error={errors.imagery?.south?.message} />
                <ImageUploadCard label="East View →" value={imageryValues?.east} onUpload={(url) => handleImage('east', url)} error={errors.imagery?.east?.message} />
                <ImageUploadCard label="West View ←" value={imageryValues?.west} onUpload={(url) => handleImage('west', url)} error={errors.imagery?.west?.message} />
                {extraImages.map((value, index) => (
                  <ImageUploadCard
                    key={`extra-${index}`}
                    label={`Other View ${index + 1}`}
                    value={value}
                    onUpload={(url) => {
                      const newExtra = [...extraImages];
                      newExtra[index] = url;
                      setValue('imagery.extra', newExtra, { shouldValidate: true, shouldDirty: true });
                    }}
                    error={errors.imagery?.extra?.[index]?.message}
                  />
                ))}
              </div>
            </div>

            {/* Profile Section */}
            <div className="mt-6 mb-4 p-1">
              <div className="mb-6 border-b border-gray-100 !p-3">
                <h3 className="text-[15px] font-bold text-gray-900">Add Profile</h3>
              </div>
              <div className="w-full lg:w-[calc(25%-18px)] !pb-10 !pt-2">
                <ImageUploadCard value={imageryValues?.profile} onUpload={(url) => handleImage('profile', url)} error={errors.imagery?.profile?.message} />
              </div>
            </div>

            <div className="flex items-center justify-end pt-6 mt-4 border-t border-gray-100 !p-2">
              <button
                type="submit"
                disabled={!isValid}
                className={`h-[44px] px-[24px] pr-[28px] rounded-[10px] text-[15px] font-medium transition-colors shadow-lg flex items-center shadow-[#0F172A]/20 ${!isValid ? 'bg-gray-300 text-gray-500 cursor-not-allowed border-transparent shadow-none' : 'bg-[#0F172A] hover:bg-gray-800 text-white'
                  }`}
              >
                <CreateButtonIcon />
                Create Organization
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateOrganization;
