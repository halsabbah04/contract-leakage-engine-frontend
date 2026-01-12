import { useState } from 'react';
import { FileText, User, DollarSign, Calendar, Building } from 'lucide-react';
import type { ContractMetadata } from '@contract-leakage/shared-types';

interface ContractMetadataFormProps {
  onSubmit: (data: { contractName: string; uploadedBy: string; metadata: ContractMetadata }) => void;
  disabled?: boolean;
  defaultContractName?: string;
}

export default function ContractMetadataForm({
  onSubmit,
  disabled = false,
  defaultContractName = '',
}: ContractMetadataFormProps) {
  const [contractName, setContractName] = useState(defaultContractName);
  const [uploadedBy, setUploadedBy] = useState('');
  const [contractValue, setContractValue] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [counterpartyName, setCounterpartyName] = useState('');
  const [autoRenewal, setAutoRenewal] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!contractName.trim()) {
      newErrors.contractName = 'Contract name is required';
    }

    if (!uploadedBy.trim()) {
      newErrors.uploadedBy = 'Uploaded by is required';
    }

    if (uploadedBy.trim() && !uploadedBy.includes('@')) {
      newErrors.uploadedBy = 'Please enter a valid email address';
    }

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      newErrors.endDate = 'End date must be after start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const metadata: ContractMetadata = {
      contract_value: contractValue ? parseFloat(contractValue) : undefined,
      currency: currency || 'USD',
      start_date: startDate || undefined,
      end_date: endDate || undefined,
      auto_renewal: autoRenewal,
      counterparty_name: counterpartyName || undefined,
    };

    onSubmit({
      contractName: contractName.trim(),
      uploadedBy: uploadedBy.trim(),
      metadata,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Required Fields */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
          <FileText size={20} className="text-primary" />
          <span>Contract Information</span>
        </h3>

        {/* Contract Name */}
        <div>
          <label htmlFor="contractName" className="block text-sm font-medium text-gray-700 mb-1">
            Contract Name <span className="text-error">*</span>
          </label>
          <input
            type="text"
            id="contractName"
            value={contractName}
            onChange={(e) => setContractName(e.target.value)}
            placeholder="e.g., Master Services Agreement"
            className={`input ${errors.contractName ? 'border-error' : ''}`}
            disabled={disabled}
            required
          />
          {errors.contractName && (
            <p className="mt-1 text-sm text-error">{errors.contractName}</p>
          )}
        </div>

        {/* Uploaded By */}
        <div>
          <label htmlFor="uploadedBy" className="block text-sm font-medium text-gray-700 mb-1">
            Uploaded By (Email) <span className="text-error">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User size={18} className="text-gray-400" />
            </div>
            <input
              type="email"
              id="uploadedBy"
              value={uploadedBy}
              onChange={(e) => setUploadedBy(e.target.value)}
              placeholder="your.email@company.com"
              className={`input pl-10 ${errors.uploadedBy ? 'border-error' : ''}`}
              disabled={disabled}
              required
            />
          </div>
          {errors.uploadedBy && (
            <p className="mt-1 text-sm text-error">{errors.uploadedBy}</p>
          )}
        </div>
      </div>

      {/* Optional Fields */}
      <div className="space-y-4 pt-4 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">
          Additional Details <span className="text-sm font-normal text-gray-500">(Optional)</span>
        </h3>

        {/* Contract Value & Currency */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label htmlFor="contractValue" className="block text-sm font-medium text-gray-700 mb-1">
              Contract Value
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign size={18} className="text-gray-400" />
              </div>
              <input
                type="number"
                id="contractValue"
                value={contractValue}
                onChange={(e) => setContractValue(e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="input pl-10"
                disabled={disabled}
              />
            </div>
          </div>

          <div>
            <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
              Currency
            </label>
            <select
              id="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="input"
              disabled={disabled}
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="JPY">JPY</option>
              <option value="AUD">AUD</option>
              <option value="CAD">CAD</option>
            </select>
          </div>
        </div>

        {/* Counterparty Name */}
        <div>
          <label htmlFor="counterpartyName" className="block text-sm font-medium text-gray-700 mb-1">
            Counterparty Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Building size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              id="counterpartyName"
              value={counterpartyName}
              onChange={(e) => setCounterpartyName(e.target.value)}
              placeholder="e.g., Vendor Company Inc."
              className="input pl-10"
              disabled={disabled}
            />
          </div>
        </div>

        {/* Contract Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar size={18} className="text-gray-400" />
              </div>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="input pl-10"
                disabled={disabled}
              />
            </div>
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar size={18} className="text-gray-400" />
              </div>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={`input pl-10 ${errors.endDate ? 'border-error' : ''}`}
                disabled={disabled}
              />
            </div>
            {errors.endDate && (
              <p className="mt-1 text-sm text-error">{errors.endDate}</p>
            )}
          </div>
        </div>

        {/* Auto Renewal */}
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="autoRenewal"
            checked={autoRenewal}
            onChange={(e) => setAutoRenewal(e.target.checked)}
            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
            disabled={disabled}
          />
          <label htmlFor="autoRenewal" className="text-sm font-medium text-gray-700">
            Auto-renewal clause present
          </label>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={disabled}
          className="w-full btn btn-primary shadow-primary text-base py-3"
        >
          {disabled ? (
            <>
              <span className="spinner mr-2"></span>
              Processing...
            </>
          ) : (
            'Upload and Analyze Contract'
          )}
        </button>
      </div>
    </form>
  );
}
