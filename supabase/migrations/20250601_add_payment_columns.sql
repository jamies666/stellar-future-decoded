
-- Add missing columns to payments table
ALTER TABLE payments 
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS paypal_order_id text,
ADD COLUMN IF NOT EXISTS amount decimal(10,2),
ADD COLUMN IF NOT EXISTS currency text DEFAULT 'USD',
ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS paypal_capture_data jsonb;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_paypal_order_id ON payments(paypal_order_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

-- Add RLS policies
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to read their own payments
CREATE POLICY IF NOT EXISTS "Users can read own payments" ON payments
FOR SELECT USING (auth.uid() = user_id);

-- Policy to allow the service role to insert payments (for edge functions)
CREATE POLICY IF NOT EXISTS "Service role can insert payments" ON payments
FOR INSERT WITH CHECK (true);

-- Policy to allow the service role to update payments (for edge functions)  
CREATE POLICY IF NOT EXISTS "Service role can update payments" ON payments
FOR UPDATE USING (true);
