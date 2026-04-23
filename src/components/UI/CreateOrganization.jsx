import React, { useEffect } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useOrganizationDetails } from '../../hooks/api/useOrgQueries';
import { Plus, X, ChevronRight, ChevronLeft, Building, User, Mail, Phone, MapPin, Globe, Image as ImageIcon } from 'lucide-react';
import InputField from './InputField';
import SelectField from './SelectField';
import ImageUploadCard from './ImageUploadCard';
import Badge from './Badge';



const orgSchema = z.object({
  name: z.string().trim()
    .min(3, "Name of Organization must be at least 3 characters")
    .max(50, "Organization name cannot exceed 50 characters"),
  industry: z.string().min(1, "Industry Type is required"),
  occupancyType: z.string().min(1, "Occupancy Type is required"),
  classification: z.string().min(1, 'Classification is required'),
  plannedSites: z.number()
    .min(0, 'Must be positive')
    .max(20, 'Maximum 20 sites allowed')
    .default(0),

  contactPerson: z.string().min(1, 'Contact person is required'),
  contactEmail: z.string().trim().min(1, "Contact Email is required").email("Invalid email format"),
  contactPhone: z.string().trim()
    .regex(/^(?:\+91|91)?[6-9]\d{9}$/, "Must be a valid Indian number (+91 followed by 10 digits)"),
  address: z.string().trim().min(5, "Address must be at least 5 characters"),
  city: z.string().trim().min(1, "City is required"),
  state: z.string().trim().min(1, "State is required"),
  country: z.string().trim().min(1, "Country is required"),
  otherInfo: z.string().optional(),
  imagery: z.object({
    north: z.string().optional(),
    south: z.string().optional(),
    east: z.string().optional(),
    west: z.string().optional(),
    profile: z.string().min(1, "Profile logo is required"),
    extra: z.array(z.string().min(1, "Upload an image")).optional()
  })
});

const CreateOrganization = ({ isOpen = true, org = null, onSubmit, onClose, isViewOnly = false, isSubmitting = false }) => {
  const [step, setStep] = React.useState(1);
  const [imageFiles, setImageFiles] = React.useState({});
  const { register, handleSubmit, formState: { errors }, setValue, watch, reset, trigger, getValues } = useForm({
    resolver: zodResolver(orgSchema),
    mode: "all",
    defaultValues: {
      name: '',
      industry: 'Manufacturing & Heavy Industry',
      occupancyType: 'Industrial Factory',
      classification: 'Group H - High Hazard',
      plannedSites: 0,
      contactPerson: '',
      contactEmail: '',
      contactPhone: '',
      address: '',
      city: '',
      state: '',
      country: 'India',
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

  const mapOrgBackendToFrontend = (data) => {
    if (!data) return null;

    // Map imagery array back to form object, being resilient to already-mapped data
    const imagery = {
      north: data.imagery?.north || '',
      south: data.imagery?.south || '',
      east: data.imagery?.east || '',
      west: data.imagery?.west || '',
      profile: data.imagery?.profile || '',
      extra: Array.isArray(data.imagery?.extra) ? [...data.imagery.extra] : []
    };

    if (Array.isArray(data.images)) {
      data.images.forEach(img => {
        const type = (img.image_type || '').toLowerCase();
        if (['north', 'south', 'east', 'west', 'profile'].includes(type)) {
          if (!imagery[type]) imagery[type] = img.image_url;
        } else if (type === 'extra') {
          if (!imagery.extra.includes(img.image_url)) imagery.extra.push(img.image_url);
        }
      });
    }

    return {
      id: data.id,
      name: data.organisation_name || data.name || '',
      industry: data.industry_type || data.industry || 'Manufacturing & Heavy Industry',
      occupancyType: data.occupancy_type || data.occupancyType || 'Industrial Factory',
      classification: data.classification || 'Group H - High Hazard',
      plannedSites: data.planned_sites !== undefined ? data.planned_sites : (data.plannedSites || 0),
      contactPerson: data.contact_person_name || data.contactPerson || '',
      contactEmail: data.contact_email || data.contactEmail || '',
      contactPhone: data.contact_phone || data.contactPhone || '',
      address: data.address || '',
      city: data.city || '',
      state: data.state || '',
      country: data.country || 'India',
      otherInfo: data.description || data.otherInfo || '',
      imagery
    };
  };

  const { data: fullOrg } = useOrganizationDetails(org?.id, { enabled: !!org?.id && isOpen });

    useEffect(() => {
      if (!isOpen) {
        setTimeout(() => setStep(1), 300); // Reset after exit animation
      }
      const targetOrg = fullOrg || org;
      if (targetOrg && targetOrg.id) {
        const formData = mapOrgBackendToFrontend(targetOrg);
        reset(formData);
      } else {
        reset({
          name: '',
          industry: 'Manufacturing & Heavy Industry',
          occupancyType: 'Industrial Factory',
          classification: 'Group H - High Hazard',
          plannedSites: 0,
          contactPerson: '',
          contactEmail: '',
          contactPhone: '',
          address: '',
          city: '',
          state: '',
          country: 'India',
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

    // eslint-disable-next-line react-hooks/incompatible-library
    const imageryValues = watch('imagery');
    const nameValue = watch('name');
    const extraImages = watch('imagery.extra') || [];

    const handleImage = (view, url, file) => {
      if (isViewOnly) return;
      setValue(`imagery.${view}`, url, { shouldValidate: true, shouldDirty: true });
      if (file) {
        setImageFiles(prev => ({ ...prev, [view]: file }));
      } else {
        setImageFiles(prev => {
          const next = { ...prev };
          delete next[view];
          return next;
        });
      }
    };

    const handleExtraImage = (index, url, file) => {
      if (isViewOnly || isSubmitting) return;
      const newUrls = [...extraImages];
      newUrls[index] = url;
      setValue('imagery.extra', newUrls, { shouldValidate: true, shouldDirty: true });

      setImageFiles(prev => {
        const newExtra = [...(prev.extra || [])];
        if (file) {
          newExtra[index] = file;
        } else {
          newExtra.splice(index, 1);
        }
        return { ...prev, extra: newExtra };
      });
    };

    const submitForm = (data) => {
      if (isViewOnly || isSubmitting) return;
      if (onSubmit) {
        onSubmit({
          id: org?.id,
          ...data,
          is_active: org?.is_active,
          imageFiles: imageFiles, // Pass actual files for backend processing
          status: org?.status || "PENDING",
          lastInventoryAudit: org?.lastInventoryAudit || new Date().toISOString(),
          stats: org?.stats || { sites: 0, floors: 0, zones: 0 }
        });
      }
    };

    const isNameValid = nameValue?.trim()?.length > 0 && !errors.name;

    const nextStep = async () => {
      let fieldsToValidate = [];
      if (step === 1) fieldsToValidate = ['name', 'industry', 'occupancyType', 'classification', 'plannedSites', 'imagery.profile'];
      if (step === 2) fieldsToValidate = ['contactPerson', 'contactEmail', 'contactPhone', 'address', 'city', 'state', 'country'];

      const result = await trigger(fieldsToValidate);
      if (result) setStep(step + 1);
    };

    const prevStep = () => setStep(step - 1);

    const ProgressIndicator = () => (
      <div className="px-6 mb-4">
        <div className="flex items-center justify-between relative">
          {/* Progress Line */}
          <div className="absolute top-4 left-10 right-10 h-[2px] bg-border-main -translate-y-1/2 z-0" />
          <div
            className="absolute top-4 left-10 h-[2px] bg-primary -translate-y-1/2 z-0 transition-all duration-500 ease-out"
            style={{ width: `calc(((100% - 80px) / 2) * ${step - 1})` }}
          />

          {/* Steps */}
          {[1, 2, 3].map((s) => (
            <div key={s} className="relative z-10 flex flex-col items-center w-20">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold transition-all duration-300 border-2 ${step >= s ? 'bg-primary border-primary text-white scale-110 shadow-md' : 'bg-base border-border-main text-gray'
                }`}>
                {step > s ? '✓' : s}
              </div>
              <span className={`text-[10px] font-black uppercase tracking-[0.15em] mt-2.5 whitespace-nowrap text-center ${step >= s ? 'text-primary' : 'text-gray/60'}`}>
                {s === 1 ? 'Primary' : s === 2 ? 'Contact' : 'Imagery'}
              </span>
            </div>
          ))}
        </div>
      </div>
    );

    return (
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <Motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl"
            />

            <Motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-[850px] max-h-[90vh] bg-card/95 border border-white/10 backdrop-blur-2xl rounded-[var(--radius-card)] shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Modal Header */}
              <div className="relative z-10 p-6 pb-4 flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-title tracking-tight leading-none mb-2 flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-xl">
                      <Building size={22} className="text-primary" />
                    </div>
                    {isViewOnly ? 'Organization Details' : org ? 'Update Organization' : 'Register New Organization'}
                  </h2>
                  <div className="flex items-center gap-2">
                    <Badge variant={isViewOnly ? 'info' : 'success'} className="px-3 py-1">
                      {isViewOnly ? 'Review Mode' : org ? 'Modification' : 'Fresh Setup'}
                    </Badge>
                    <span className="text-[10px] text-gray uppercase tracking-widest font-bold">Step {step} of 3</span>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2.5 rounded-full hover:bg-base text-gray hover:text-title transition-all duration-200"
                >
                  <X size={20} />
                </button>
              </div>

              <ProgressIndicator />

              {/* Modal Body */}
              <div className="relative z-10 flex-1 overflow-y-auto px-8 pb-8 custom-scrollbar pt-4">
                <form onSubmit={handleSubmit(submitForm)} className="flex flex-col">
                  <AnimatePresence mode="wait">
                    {step === 1 && (
                      <Motion.div
                        key="step1"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={{
                          hidden: { opacity: 0 },
                          visible: {
                            opacity: 1,
                            transition: { staggerChildren: 0.08 }
                          },
                          exit: { opacity: 0, x: -20 }
                        }}
                        className="flex flex-col gap-8"
                      >
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-6">
                          <Motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
                            <InputField
                              label="Organization Name"
                              required
                              icon={<Building />}
                              placeholder="e.g. Apex Global Industries"
                              {...register("name")}
                              maxLength={50}
                              error={errors.name?.message}
                              isValid={isNameValid}
                              disabled={isViewOnly}
                            />
                          </Motion.div>
                          <Motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
                            <SelectField
                              label="Industry Category"
                              icon={<Badge size={14} />}
                              {...register("industry")}
                              error={errors.industry?.message}
                              options={["Manufacturing & Heavy Industry", "Construction", "Healthcare", "Warehousing"]}
                              disabled={isViewOnly}
                            />
                          </Motion.div>
                          <Motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
                            <SelectField
                              label="Occupancy Type"
                              {...register("occupancyType")}
                              error={errors.occupancyType?.message}
                              options={["Industrial Factory", "Commercial Complex", "High-Rise Warehouse", "Retail Outlet"]}
                              disabled={isViewOnly}
                            />
                          </Motion.div>
                          <Motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
                            <SelectField
                              label="Building Classification"
                              {...register("classification")}
                              error={errors.classification?.message}
                              options={[
                                "Group H - High Hazard",
                                "Group B - Business",
                                "Group S - Storage",
                                "Group F - Factory"
                              ]}
                              disabled={isViewOnly}
                            />
                          </Motion.div>
                          <Motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
                            <InputField
                              label="Total Sites"
                              type="number"
                              min="0"
                              max="20"
                              onKeyDown={(e) => {
                                if (['-', 'e', '+', '.'].includes(e.key)) e.preventDefault();
                              }}
                              placeholder="e.g., 5"
                              {...register('plannedSites', { valueAsNumber: true })}
                              error={errors.plannedSites?.message}
                              disabled={isViewOnly}
                            />
                          </Motion.div>
                        </div>

                        <Motion.div
                          variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
                          className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4 border-t border-border-main/50"
                        >
                          <div className="lg:col-span-1">
                            <ImageUploadCard
                              label="Identity Logo"
                              value={imageryValues?.profile}
                              error={errors.imagery?.profile?.message}
                              onUpload={(url, file) => handleImage('profile', url, file)}
                            />
                          </div>
                          <div className="lg:col-span-2">
                            <label className="text-[12px] font-bold text-gray uppercase tracking-widest mb-2 block ml-1">About Organization</label>
                            <textarea
                              {...register("otherInfo")}
                              placeholder="Nature of business, facility highlights, or unique operational details..."
                              className="w-full h-[120px] p-4 rounded-xl border-1.5 border-border-main bg-base/30 text-[13px] text-title placeholder:text-gray/50 focus:border-primary focus:bg-white outline-none transition-all duration-300 resize-none"
                            />
                          </div>
                        </Motion.div>
                      </Motion.div>
                    )}

                    {step === 2 && (
                      <Motion.div
                        key="step2"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={{
                          hidden: { opacity: 0 },
                          visible: {
                            opacity: 1,
                            transition: { staggerChildren: 0.08 }
                          },
                          exit: { opacity: 0, x: -20 }
                        }}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-8"
                      >
                        <Motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
                          <InputField
                            label="Contact Representative"
                            icon={<User />}
                            required
                            placeholder="Full Name"
                            {...register("contactPerson")}
                            error={errors.contactPerson?.message}
                          />
                        </Motion.div>
                        <Motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
                          <InputField
                            label="Work Email"
                            icon={<Mail />}
                            type="email"
                            required
                            placeholder="contact@org.com"
                            {...register("contactEmail")}
                            error={errors.contactEmail?.message}
                          />
                        </Motion.div>
                        <Motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
                          <InputField
                            label="Mobile Number"
                            icon={<Phone />}
                            type="tel"
                            required
                            {...register("contactPhone")}
                            onKeyDown={(e) => {
                              // Allow: backspace, delete, tab, escape, enter, control+a, home, end, left, right
                              if ([46, 8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
                                (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
                                (e.keyCode >= 35 && e.keyCode <= 40)) {
                                return;
                              }
                              // Ensure that it is a number and stop the keypress if length >= 13 (to allow +91 + 10 digits)
                              const isNumber = (e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105);
                              const isPlus = e.keyCode === 107 || (e.shiftKey && e.keyCode === 187);

                              if (!isNumber && !isPlus) {
                                e.preventDefault();
                              }

                              const currentVal = e.target.value;
                              const digitCount = currentVal.replace(/[^0-9]/g, '').length;
                              if (digitCount >= 12 && isNumber && ![8, 46, 37, 39].includes(e.keyCode)) {
                                e.preventDefault();
                              }
                            }}
                            placeholder="+91 00000 00000"
                            error={errors.contactPhone?.message}
                          />
                        </Motion.div>
                        <Motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
                          <InputField
                            label="Operational Address"
                            icon={<MapPin />}
                            required
                            placeholder="Street, Building No."
                            {...register("address")}
                            error={errors.address?.message}
                          />
                        </Motion.div>
                        <Motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
                          <InputField
                            label="City / Region"
                            placeholder="Current City"
                            {...register("city")}
                            error={errors.city?.message}
                          />
                        </Motion.div>
                        <Motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }} className="grid grid-cols-2 gap-4">
                          <InputField
                            label="Province"
                            placeholder="State"
                            {...register("state")}
                          />
                          <InputField
                            label="Country"
                            icon={<Globe size={14} />}
                            placeholder="India"
                            {...register("country")}
                          />
                        </Motion.div>
                      </Motion.div>
                    )}

                    {step === 3 && (
                      <Motion.div
                        key="step3"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={{
                          hidden: { opacity: 0 },
                          visible: {
                            opacity: 1,
                            transition: { staggerChildren: 0.08 }
                          },
                          exit: { opacity: 0, x: -20 }
                        }}
                        className="flex flex-col gap-8"
                      >
                        <div className="grid grid-cols-1 gap-8">
                          <Motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }} className="space-y-4">
                            <div className="flex items-center justify-between border-b border-border-main pb-2">
                              <h3 className="text-sm font-bold text-title flex items-center gap-2">
                                <ImageIcon className="text-primary" size={16} /> Site Perspectives
                              </h3>
                              <button
                                type="button"
                                className="flex items-center gap-2 px-4 py-2 bg-primary/5 hover:bg-primary/10 text-primary border border-primary/20 rounded-xl transition-all duration-300 font-bold text-[11px] uppercase tracking-wider group"
                                onClick={() => {
                                  const currentExtra = getValues('imagery.extra') || [];
                                  setValue('imagery.extra', [...currentExtra, ''], { shouldValidate: true, shouldDirty: true });
                                }}
                              >
                                <Plus size={14} /> Add View
                              </button>
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                              <ImageUploadCard label="North View ↑" value={imageryValues?.north} error={errors.imagery?.north?.message} onUpload={(url, file) => handleImage('north', url, file)} />
                              <ImageUploadCard label="South View ↓" value={imageryValues?.south} error={errors.imagery?.south?.message} onUpload={(url, file) => handleImage('south', url, file)} />
                              <ImageUploadCard label="East View →" value={imageryValues?.east} error={errors.imagery?.east?.message} onUpload={(url, file) => handleImage('east', url, file)} />
                              <ImageUploadCard label="West View ←" value={imageryValues?.west} error={errors.imagery?.west?.message} onUpload={(url, file) => handleImage('west', url, file)} />
                            </div>
                          </Motion.div>
                        </div>

                        {extraImages.length > 0 && (
                          <Motion.div
                            initial="hidden"
                            animate="visible"
                            variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
                            className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-4 border-t border-border-main"
                          >
                            {extraImages.map((value, index) => (
                              <ImageUploadCard
                                key={`extra-${index}`}
                                label={`Ext View ${index + 1}`}
                                value={value}
                                onUpload={(url, file) => handleExtraImage(index, url, file)}
                              />
                            ))}
                          </Motion.div>
                        )}
                      </Motion.div>
                    )}
                  </AnimatePresence>
                </form>
              </div>

              {/* Modal Footer */}
              <div className="p-6 bg-base/50 border-t border-border-main flex items-center justify-between">
                <Motion.button
                  type="button"
                  whileHover={{ x: -4 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={step === 1 ? onClose : prevStep}
                  className="h-11 px-6 rounded-xl text-[11px] font-bold uppercase tracking-wider text-gray hover:text-title hover:bg-base transition-all flex items-center gap-2"
                >
                  <ChevronLeft size={16} /> {step === 1 ? 'Cancel' : 'Back'}
                </Motion.button>

                <div className="flex items-center gap-3">
                  {step < 3 ? (
                    <Motion.button
                      type="button"
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={nextStep}
                      className="h-11 px-8 rounded-xl text-[11px] font-bold uppercase tracking-wider bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all flex items-center gap-2"
                    >
                      Continue <ChevronRight size={16} />
                    </Motion.button>
                  ) : (
                    <Motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSubmit(submitForm)}
                      disabled={isSubmitting}
                      className={`h-11 px-8 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 min-w-[160px] ${isSubmitting ? 'bg-base text-gray cursor-not-allowed opacity-80' : 'bg-primary hover:bg-primary/95 text-white shadow-primary/20'}`}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-current" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          {org ? 'Commit Changes' : 'Finalize Registration'}
                          <ChevronRight size={16} />
                        </>
                      )}
                    </Motion.button>
                  )}
                </div>
              </div>
            </Motion.div>
          </div>
        )}
      </AnimatePresence>
    );
  };

  export default CreateOrganization;
