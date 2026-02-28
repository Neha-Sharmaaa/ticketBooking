import { useState } from 'react';

export default function PaymentModal({ amount, onConfirm, onCancel, isProcessing }) {
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (cardNumber && expiry && cvc) {
            onConfirm();
        }
    };

    return (
        <div className="modal-overlay">
            <div className="auth-card modal-content" style={{ margin: 'auto' }}>
                <h2 className="auth-title" style={{ marginBottom: '1rem' }}>Complete Payment</h2>
                <p className="text-secondary text-center mb-4">Amount Due: <strong>${amount}</strong></p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Card Number</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="0000 0000 0000 0000"
                            maxLength="19"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            required
                            disabled={isProcessing}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label className="form-label">Expiry Date</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="MM/YY"
                                maxLength="5"
                                value={expiry}
                                onChange={(e) => setExpiry(e.target.value)}
                                required
                                disabled={isProcessing}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">CVC</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="123"
                                maxLength="4"
                                value={cvc}
                                onChange={(e) => setCvc(e.target.value)}
                                required
                                disabled={isProcessing}
                            />
                        </div>
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
                            {isProcessing ? 'Processing...' : 'Pay Now'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
