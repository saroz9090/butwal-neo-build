import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, FileText, ShieldCheck, ArrowRight, Building2, Flame } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const navigate = useNavigate();

  const handleOpenEmployeePortal = () => {
    onClose();
    window.open("https://employee.butwalconstruction.com.np", "_blank", "noopener,noreferrer");
  };

  const handleOpenErpSystem = () => {
    onClose();
    window.open("https://accounts.butwalconstruction.com.np", "_blank", "noopener,noreferrer");
  };

  const handleOpenWebsiteAdmin = () => {
    onClose();
    navigate("/login");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[560px] p-6 glass border-border shadow-2xl rounded-2xl">
        <DialogHeader className="space-y-3 text-center pb-2 border-b border-border">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center text-primary mb-1">
            <Building2 className="w-6 h-6" />
          </div>
          <DialogTitle className="text-2xl font-extrabold text-foreground tracking-tight">
            Select Portal to Login
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground max-w-md mx-auto">
            Choose which Butwal Construction & Builders system you would like to access:
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3.5 pt-4">
          {/* Option 1: Employee Portal */}
          <div 
            onClick={handleOpenEmployeePortal}
            className="p-4 rounded-xl border border-border hover:border-primary/50 bg-card/60 hover:bg-card transition-all duration-300 cursor-pointer group flex items-start justify-between gap-4 shadow-sm hover:shadow-md"
          >
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors">
                    Employee Portal
                  </h3>
                  <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/30 text-[11px]">
                    HR & Attendance
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Staff attendance, daily site logs, field management & employee service desk.
                </p>
              </div>
            </div>
            <Button size="icon" variant="ghost" className="shrink-0 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all">
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Option 2: ERP System */}
          <div 
            onClick={handleOpenErpSystem}
            className="p-4 rounded-xl border border-border hover:border-emerald-500/50 bg-card/60 hover:bg-card transition-all duration-300 cursor-pointer group flex items-start justify-between gap-4 shadow-sm hover:shadow-md"
          >
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-base text-foreground group-hover:text-emerald-500 transition-colors">
                    ERP & Accounts System
                  </h3>
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30 text-[11px]">
                    Finance & Billing
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Financial accounting, client billing, material inventory, purchase orders & ledgers.
                </p>
              </div>
            </div>
            <Button size="icon" variant="ghost" className="shrink-0 text-muted-foreground group-hover:text-emerald-500 group-hover:translate-x-1 transition-all">
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Option 3: Website Admin Portal (Firebase) */}
          <div 
            onClick={handleOpenWebsiteAdmin}
            className="p-4 rounded-xl border border-primary/40 hover:border-primary bg-primary/5 hover:bg-primary/10 transition-all duration-300 cursor-pointer group flex items-start justify-between gap-4 shadow-sm hover:shadow-md"
          >
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-lg bg-primary text-primary-foreground group-hover:scale-105 transition-transform duration-300">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors">
                    Website Admin Portal
                  </h3>
                 
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Internal admin dashboard for managing house designs, cost estimates, client leads & website content.
                </p>
                <p className="text-[11px] font-semibold text-primary mt-1">
                  Internal Website Management Portal →
                </p>
              </div>
            </div>
            <Button size="icon" variant="ghost" className="shrink-0 text-primary group-hover:translate-x-1 transition-all">
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
