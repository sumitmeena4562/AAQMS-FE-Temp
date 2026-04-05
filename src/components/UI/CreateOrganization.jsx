import React, { useEffect } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, X, ChevronRight, ChevronLeft, Building, User, Mail, Phone, MapPin, Globe, FileText, Image as ImageIcon } from 'lucide-react';
import InputField from './InputField';
import SelectField from './SelectField';
import ImageUploadCard from './ImageUploadCard';
import Badge from './Badge';

const BuildingIcon = () => (
  <Building className="w-5 h-5 text-primary" />
);

const CreateButtonIcon = () => (
  <Plus className="w-4 h-4 mr-2" />
);

const ImageIconIcon = () => (
  <svg className="w-5 h-5 text-gray" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const orgSchema = z.object({
  name: z.string().trim().min(3, "Name of Organization must be at least 3 characters").max(255, "Name too long"),
  industry: z.string().min(1, "Industry Type is required"),
  occupancyType: z.string().min(1, "Occupancy Type is required"),
  classification: z.string().min(1, "Classification of Occupancy is required"),
  contactPerson: z.string().trim().min(2, "Contact Person Name is required"),
  contactEmail: z.string().trim().min(1, "Contact Email is required").email("Invalid email format"),
  contactPhone: z.string().trim().regex(/^\d{10}$/, "Must be exactly 10 digits"),
  address: z.string().trim().min(5, "Address must be at least 5 characters"),
  city: z.string().trim().min(1, "City is required"),
  state: z.string().trim().min(1, "State is required"),
  country: z.string().trim().min(1, "Country is required"),
  otherInfo: z.string().optional(),
  imagery: z.object({
    north: z.string().min(1, "North view image is required"),
    south: z.string().min(1, "South view image is required"),
    east: z.string().min(1, "East view image is required"),
    west: z.string().min(1, "West view image is required"),
    profile: z.string().min(1, "Profile logo is required"),
    extra: z.array(z.string().min(1, "Upload an image")).optional()
  })
});

const CreateOrganization = ({ isOpen = true, org = null, onSubmit, onClose, onEdit, isViewOnly = false, isSubmitting = false }) => {
  const [step, setStep] = React.useState(1);
  const [imageFiles, setImageFiles] = React.useState({});
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

  // Helper to map Backend data back to Frontend form format
  const mapOrgBackendToFrontend = (data) => {
    if (!data) return null;
    
    // Map imagery array back to form object
    const imagery = {
      north: '', south: '', east: '', west: '', profile: '', extra: []
    };
    
    if (Array.isArray(data.images)) {
      data.images.forEach(img => {
        const type = (img.image_type || '').toLowerCase();
        if (['north', 'south', 'east', 'west', 'profile'].includes(type)) {
          imagery[type] = img.image_url;
        } else if (type === 'extra') {
          imagery.extra.push(img.image_url);
        }
      });
    }

    return {
      name: data.organisation_name || '',
      industry: data.industry_type || 'Manufacturing & Heavy Industry',
      occupancyType: data.occupancy_type || 'Industrial Factory',
      classification: data.classification || 'Group H - High Hazard',
      contactPerson: data.contact_person_name || '',
      contactEmail: data.contact_email || '',
      contactPhone: data.contact_phone || '',
      address: data.address || '',
      city: data.city || '',
      state: data.state || '',
      country: data.country || 'India',
      otherInfo: data.description || '',
      imagery
    };
  };

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => setStep(1), 300); // Reset after exit animation
    }
    if (org && org.id) {
      const formData = mapOrgBackendToFrontend(org);
      reset(formData);
    } else {
      reset({
        name: '',
        industry: 'Manufacturing & Heavy Industry',
        occupancyType: 'Industrial Factory',
        classification: 'Group H - High Hazard',
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
  const extraImages = imageryValues?.extra || [];

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
    if (step === 1) fieldsToValidate = ['name', 'industry', 'occupancyType', 'classification'];
    if (step === 2) fieldsToValidate = ['contactPerson', 'contactEmail', 'contactPhone', 'address', 'city', 'state', 'country'];
    
    const result = await trigger(fieldsToValidate);
    if (result) setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const ProgressIndicator = () => (
    <div className="px-6 mb-4">
      <div className="flex items-center justify-between relative">
        {/* Progress Line */}
        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-border-main -translate-y-1/2 z-0" />
        <div 
          className="absolute top-1/2 left-0 h-[2px] bg-primary -translate-y-1/2 z-0 transition-all duration-500 ease-out" 
          style={{ width: `${((step - 1) / 2) * 100}%` }}
        />
        
        {/* Steps */}
        {[1, 2, 3].map((s) => (
          <div key={s} className="relative z-10 flex flex-col items-center">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-all duration-300 border-2 ${
              step >= s ? 'bg-primary border-primary text-white scale-110 shadow-md' : 'bg-base border-border-main text-gray'
            }`}>
              {step > s ? '✓' : s}
            </div>
            <span className={`text-[9px] font-bold uppercase tracking-wider mt-1.5 ${step >= s ? 'text-primary' : 'text-gray'}`}>
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
                      </div>

                      <Motion.div 
                        variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
                        className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4 border-t border-border-main/50"
                      >
                        <div className="lg:col-span-1">
                          <ImageUploadCard 
                            label="Identity Logo" 
                            value={imageryValues?.profile} 
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
                          placeholder="10-digit number"
                          {...register("contactPhone")}
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
                              onClick={() => setValue('imagery.extra', [...extraImages, ''])}
                              className="text-[10px] bg-primary/5 hover:bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full font-bold uppercase transition-all"
                            >
                              + Add View
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            <ImageUploadCard label="North View ↑" value={imageryValues?.north} onUpload={(url, file) => handleImage('north', url, file)} />
                            <ImageUploadCard label="South View ↓" value={imageryValues?.south} onUpload={(url, file) => handleImage('south', url, file)} />
                            <ImageUploadCard label="East View →" value={imageryValues?.east} onUpload={(url, file) => handleImage('east', url, file)} />
                            <ImageUploadCard label="West View ←" value={imageryValues?.west} onUpload={(url, file) => handleImage('west', url, file)} />
                          </div>
                        </Motion.div>
                      </div>

                      {extraImages.length > 0 && (
                        <Motion.div 
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
              <motion.button
                type="button"
                whileHover={{ x: -4 }}
                whileTap={{ scale: 0.95 }}
                onClick={step === 1 ? onClose : prevStep}
                className="h-11 px-6 rounded-xl text-[11px] font-bold uppercase tracking-wider text-gray hover:text-title hover:bg-base transition-all flex items-center gap-2"
              >
                <ChevronLeft size={16} /> {step === 1 ? 'Cancel' : 'Back'}
              </motion.button>

              <div className="flex items-center gap-3">
                {step < 3 ? (
                  <motion.button
                    type="button"
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={nextStep}
                    className="h-11 px-8 rounded-xl text-[11px] font-bold uppercase tracking-wider bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all flex items-center gap-2"
                  >
                    Continue <ChevronRight size={16} />
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmit(submitForm)}
                    disabled={isSubmitting}
                    className={`h-11 px-8 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all shadow-lg flex items-center gap-2 ${isSubmitting ? 'bg-base text-gray cursor-not-allowed' : 'bg-primary hover:bg-primary/95 text-white shadow-primary/20'}`}
                  >
                    {isSubmitting ? 'Processing...' : org ? 'Commit Changes' : 'Finalize Registration'}
                  </motion.button>
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
