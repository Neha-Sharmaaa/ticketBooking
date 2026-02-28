import { useState } from 'react';

export default function PaymentModal({ amount, onConfirm, onCancel, isProcessing }) {
    const [upiId, setUpiId] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (upiId) {
            onConfirm();
        }
    };

    return (
        <div className="modal-overlay">
            <div className="auth-card modal-content" style={{ margin: 'auto' }}>
                <h2 className="auth-title" style={{ marginBottom: '1rem' }}>UPI Payment</h2>
                <p className="text-secondary text-center mb-4">Amount Due: <strong>${amount}</strong></p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">UPI ID / VPA</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="username@upi"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            required
                            disabled={isProcessing}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            style={{ flex: 1 }}
                            onClick={onCancel}
                            disabled={isProcessing}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ flex: 1 }}
                            disabled={isProcessing}
                        >
                            {isProcessing ? 'Processing...' : 'Pay with UPI'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
