import { Shield, ExternalLink } from "lucide-react";
import { motion } from "motion/react";

export function FeatureGrid() {
  return (
    <section className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-xl border-t border-outline-variant/30">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="grid grid-cols-1 md:grid-cols-3 gap-gutter"
      >
        <div className="md:col-span-2 relative overflow-hidden rounded-xl h-64 border border-outline-variant">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBGXIn8OeV4wSas67YCGQH6M5SD3Kfnc30HjaNVY1T5vXU49DYD43mCmVvJJ8BgJlgqNSAyyrFoyDB3mrp8ub2XGRfV15pV2wfXP1jOp1NkEy7wunhTHEYU-oQ8sxEHQIh1fgyvSbaZRYlVtWyOS2L_J0iNMeM1guF1rlPW58R6HWo8kn_oEVPFKmue2uwkwbeSnD11LQq5x_PtiLElR8iuf0f8wjKw7FFdmD6dp9NDs_htbAE_zBhw2kOrlEJ4uOFE7aOrv6IDCEA")',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-md left-md text-white">
            <p className="text-[12px] leading-[16px] font-semibold uppercase tracking-widest opacity-80 mb-xs">
              Our Vision
            </p>
            <h4 className="text-[20px] leading-[28px] font-semibold">Integrated Care Systems</h4>
          </div>
        </div>

        <div className="bg-surface-container-low rounded-xl p-md flex flex-col justify-between border border-outline-variant">
          <div>
            <Shield className="text-tertiary w-8 h-8 mb-sm" fill="currentColor" />
            <h4 className="text-[20px] leading-[28px] font-semibold text-on-surface mb-xs">HIPAA Compliant</h4>
            <p className="text-[14px] leading-[20px] text-on-surface-variant">
              Your data security is our highest priority, protected with enterprise-grade encryption.
            </p>
          </div>
          <a
            className="text-primary text-[12px] leading-[16px] font-semibold flex items-center hover:underline w-fit"
            href="#"
          >
            Security Standards <ExternalLink className="w-3 h-3 ml-xs" />
          </a>
        </div>
      </motion.div>
    </section>
  );
}
