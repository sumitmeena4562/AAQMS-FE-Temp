import React, { useEffect } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, X } from 'lucide-react';
import InputField from './InputField';
import SelectField from './SelectField';
import ImageUploadCard from './ImageUploadCard';

const BuildingIcon = () => (
  <svg className="w-5 h-5 text-gray" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const CreateButtonIcon = () => (
  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m-9 0v-5a1 1 0 011-1h2a1 1 0 011 1v5m4 0h4" />
  </svg>
);

const ImageIconIcon = () => (
  <svg className="w-5 h-5 text-gray" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

const CreateOrganization = ({ isOpen = true, org = null, onSubmit, onClose }) => {
  const { register, handleSubmit, formState: { errors, isValid }, setValue, watch, reset, trigger } = useForm({
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

  useEffect(() => {
    if (org) {
      reset(org);
    } else {
      reset({
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
      });
    }
  }, [org, reset, isOpen]);

  const imageryValues = watch('imagery');
  const nameValue = watch('name');
  const extraImages = imageryValues?.extra || [];

  const handleImage = (view, url) => {
    setValue(`imagery.${view}`, url, { shouldValidate: true, shouldDirty: true });
  };

  const submitForm = (data) => {
    if (onSubmit) {
      onSubmit({
        id: org?.id || String(Date.now()),
        ...data,
        status: org?.status || "ACTIVE",
        lastInventoryAudit: org?.lastInventoryAudit || new Date().toISOString(),
        stats: org?.stats || { sites: 0, floors: 0, zones: 0 }
      });
    }
  };

  const isNameValid = nameValue?.trim()?.length > 0 && !errors.name;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
          />

          <Motion.div
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            className="relative w-full max-w-[800px] max-h-[90vh] sm:max-h-[85vh] bg-card border border-border-main rounded-[var(--radius-card)] shadow-xl flex flex-col overflow-hidden"
          >
            {/* Modal Header */}
            <div className="relative z-10 p-6 pb-2 flex items-start justify-between">
              <div>
                  <h2 className="text-xl font-bold text-title tracking-tight leading-none mb-1.5 flex items-center gap-2">
                      <BuildingIcon /> {org ? 'Update Organization' : 'Create Organization'}
                  </h2>
                  <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span className="text-[10px] font-bold text-gray uppercase tracking-wider">
                          {org ? 'Modify Details' : 'New Setup'}
                      </span>
                  </div>
              </div>
              {onClose && (
                <button 
                  type="button" 
                  onClick={onClose} 
                  className="p-2 text-gray hover:bg-base hover:text-body rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {/* Modal Body */}
            <div className="relative z-10 flex-1 overflow-y-auto px-6 pb-6 custom-scrollbar mt-4 pt-1">
              <form onSubmit={handleSubmit(submitForm)} className="flex flex-col">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-7 mb-8">
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
                label="Full Address"
                placeholder="Enter full address"
                required
                {...register("address")}
                error={errors.address?.message}
              />
              <InputField
                label="Other Information (Optional)"
                placeholder="Any additional details..."
                {...register("otherInfo")}
              />
            </div>

            {/* Site Imagery Section */}
            <div className="mt-8 mb-6">
              <div className="col-span-2 flex items-center justify-between pb-1 border-b border-border-main mt-2 mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-[11px] font-bold text-gray uppercase tracking-wider">Site Imagery</h3>
                  <span className="text-[9px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full uppercase tracking-wider">Required</span>
                </div>
                <button
                  type="button"
                  onClick={() => setValue('imagery.extra', [...extraImages, ''], { shouldValidate: false, shouldDirty: true })}
                  className="bg-primary hover:bg-primary/90 text-white rounded-md px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Plus size={14} strokeWidth={2.5} />
                  Add More
                </button>
              </div>

              {/* Upload Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-[24px] pt-2">
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
            <div className="mt-6 mb-2">
              <div className="col-span-2 flex items-center gap-2 pb-1 border-b border-border-main mt-2">
                  <h3 className="text-[11px] font-bold text-gray uppercase tracking-wider">Add Profile Logo</h3>
              </div>
              <div className="w-full lg:w-1/4 pb-4 pt-3">
                <ImageUploadCard value={imageryValues?.profile} onUpload={(url) => handleImage('profile', url)} error={errors.imagery?.profile?.message} />
              </div>
            </div>
          </form>
        </div>

        {/* Modal Footer */}
        <div className="relative z-10 p-5 bg-base border-t border-border-main flex items-center justify-end">
            <div className="flex items-center gap-2">
                <button 
                    type="button"
                    onClick={onClose} 
                    className="h-10 px-4 hover:bg-base rounded-[var(--radius-button)] text-[11px] font-bold uppercase tracking-wider text-gray hover:text-title transition-colors flex items-center justify-center"
                >
                    Cancel
                </button>
                <button
                  onClick={handleSubmit(submitForm)}
                  disabled={!isValid}
                  className={`h-10 px-6 rounded-[var(--radius-button)] text-[11px] font-bold uppercase tracking-wider transition-colors shadow-sm flex items-center justify-center gap-2 ${!isValid ? 'bg-base text-gray cursor-not-allowed border-transparent shadow-none' : 'bg-primary hover:bg-primary/95 text-white'}`}
                >
                  {org ? 'Save Changes' : 'Create Organization'}
                </button>
            </div>
        </div>
          </Motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CreateOrganization;
