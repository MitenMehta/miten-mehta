-- Create tracking_codes table for managing marketing scripts
CREATE TABLE public.tracking_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT false,
  apply_to_all_pages BOOLEAN NOT NULL DEFAULT true,
  specific_pages TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tracking_codes ENABLE ROW LEVEL SECURITY;

-- Only admins can manage tracking codes
CREATE POLICY "Admins can view tracking codes"
ON public.tracking_codes
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert tracking codes"
ON public.tracking_codes
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update tracking codes"
ON public.tracking_codes
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete tracking codes"
ON public.tracking_codes
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_tracking_codes_updated_at
BEFORE UPDATE ON public.tracking_codes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Public read access for enabled tracking codes (so the script can load them)
CREATE POLICY "Everyone can view enabled tracking codes"
ON public.tracking_codes
FOR SELECT
USING (enabled = true);