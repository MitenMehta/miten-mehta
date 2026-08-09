-- Add UTM tracking and CRM columns to leads table
ALTER TABLE public.leads
ADD COLUMN landing_page TEXT NOT NULL DEFAULT 'Orbit Financial Services',
ADD COLUMN utm_source TEXT,
ADD COLUMN utm_medium TEXT,
ADD COLUMN utm_campaign TEXT,
ADD COLUMN utm_content TEXT,
ADD COLUMN utm_term TEXT,
ADD COLUMN status TEXT NOT NULL DEFAULT 'new',
ADD COLUMN notes TEXT;

-- Add check constraint for status values
ALTER TABLE public.leads
ADD CONSTRAINT leads_status_check 
CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'lost'));

-- Create index for better query performance on commonly filtered columns
CREATE INDEX idx_leads_landing_page ON public.leads(landing_page);
CREATE INDEX idx_leads_status ON public.leads(status);
CREATE INDEX idx_leads_utm_source ON public.leads(utm_source);
CREATE INDEX idx_leads_created_at ON public.leads(created_at DESC);