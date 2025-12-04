"use client";

import { useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import {
  Award,
  Download,
  Star,
  BookOpen,
  Brain,
  Target,
  Calendar,
} from "lucide-react";
import { motion } from "framer-motion";

const PRIMARY = "#206380";

const CertificateTemplate = ({
  student,
  milestone,
  date,
  instructor = "Shaykh Ahmed Al-Mansoori",
}) => {
  const certificateRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => certificateRef.current,
    documentTitle: `${student.name} - ${milestone.type} Certificate`,
  });

  const milestoneIcons = {
    hifz: "Completed Juz 30",
    tajweed: "Mastered Tajweed Rules",
    fullQuran: "Completed Quran Memorization",
    excellence: "Academic Excellence Award",
  };

  const milestoneArabic = {
    hifz: "إتمام حفظ الجزء الثلاثين",
    tajweed: "إتقان أحكام التجويد",
    fullQuran: "ختم حفظ القرآن الكريم",
    excellence: "جائزة التفوق الأكاديمي",
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full overflow-hidden"
        >
          {/* Certificate Preview */}
          <div
            ref={certificateRef}
            className="bg-gradient-to-br from-amber-50 via-yellow-50 to- emerald-50 p-12 relative"
          >
            {/* Ornamental Border */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-32 h-32 border-t-8 border-l-8 border-[#206380] rounded-tl-3xl"></div>
              <div className="absolute top-0 right-0 w-32 h-32 border-t-8 border-r-8 border-[#206380] rounded-tr-3xl"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 border-b-8 border-l-8 border-[#206380] rounded-bl-3xl"></div>
              <div className="absolute bottom-0 right-0 w-32 h-32 border-b-8 border-r-8 border-[#206380] rounded-br-3xl"></div>
            </div>

            {/* Header */}
            <div className="text-center mb-12 relative">
              <div className="flex justify-center mb-6">
                <div className="w-32 h-32 bg-gradient-to-br from-[#206380] to-[#1e5a75] rounded-full flex items-center justify-center shadow-2xl">
                  <BookOpen className="w-20 h-20 text-white" />
                </div>
              </div>
              <h1 className="text-6xl font-bold text-[#206380] mb-4 tracking-widest">
                Certificate of Achievement
              </h1>
              <p className="text-3xl text-amber-700 font-medium">شهادة تقدير</p>
            </div>

            {/* Main Content */}
            <div className="text-center space-y-8">
              <p className="text-2xl text-gray-700">This is to certify that</p>

              <div className="py-8">
                <h2 className="text-5xl font-bold text-[#206380] tracking-wide">
                  {student.name}
                </h2>
                <div className="w-96 h-1 bg-gradient-to-r from-transparent via-[#206380] to-transparent mx-auto mt-4"></div>
              </div>

              <p className="text-2xl text-gray-700">has successfully</p>

              <div className="bg-white/70 backdrop-blur-sm rounded-3xl py-8 px-16 inline-block shadow-xl border border-amber-200">
                <p className="text-4xl font-bold text-amber-800">
                  {milestoneIcons[milestone.type]}
                </p>
                <p className="text-3xl text-[#206380] mt-4 font-arabic">
                  {milestoneArabic[milestone.type]}
                </p>
              </div>

              <div className="flex justify-center gap-8 mt-12">
                <div className="text-center">
                  <p className="text-xl text-gray-600">Date of Completion</p>
                  <p className="text-2xl font-bold text-[#206380] mt-2">
                    {date}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xl text-gray-600">Instructor</p>
                  <p className="text-2xl font-bold text-[#206380] mt-2">
                    {instructor}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Seal & Signature */}
            <div className="flex justify-between items-end mt-16 px-12">
              <div className="text-left">
                <div className="w-48 h-1 bg-[#206380] mb-8"></div>
                <p className="text-lg text-gray-700">Instructor Signature</p>
              </div>

              <div className="relative">
                <div className="w-40 h-40 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center shadow-2xl border-8 border-white">
                  <Star className="w-20 h-20 text-white" />
                </div>
                <p className="text-center mt-4 text-amber-700 font-bold text-xl">
                  Official Seal
                </p>
              </div>

              <div className="text-right">
                <div className="w-48 h-1 bg-[#206380] mb-8"></div>
                <p className="text-lg text-gray-700">Director Signature</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-gradient-to-r from-[#206380] to-[#1e5a75] p-6 flex justify-center gap-6">
            <button
              onClick={handlePrint}
              className="flex items-center gap-3 px-8 py-4 bg-white text-[#206380] rounded-2xl font-bold text-lg hover:scale-105 transition shadow-lg"
            >
              <Download className="w-6 h-6" />
              Download PDF
            </button>
            <button className="px-8 py-4 bg-white/20 text-white rounded-2xl font-bold text-lg hover:bg-white/30 transition backdrop-blur">
              Share via WhatsApp
            </button>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        @font-face {
          font-family: "Amiri";
          src: url("/fonts/Amiri-Regular.ttf") format("truetype");
        }
        .font-arabic {
          font-family: "Amiri", "Traditional Arabic", serif;
        }
      `}</style>
    </>
  );
};

export default function CertificateGenerator() {
  const [showCertificate, setShowCertificate] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState(null);

  const student = {
    name: "Aisha Khan",
    batch: "2025-Quran",
  };

  const milestones = [
    {
      type: "hifz",
      label: "Completed Juz 30",
      icon: BookOpen,
      color: "from-emerald-500 to-emerald-600",
    },
    {
      type: "tajweed",
      label: "Mastered Tajweed",
      icon: Brain,
      color: "from-blue-500 to-[#206380]",
    },
    {
      type: "fullQuran",
      label: "Khatam Al-Qur'an",
      icon: Award,
      color: "from-amber-500 to-amber-600",
    },
    {
      type: "excellence",
      label: "Academic Excellence",
      icon: Star,
      color: "from-purple-500 to-purple-600",
    },
  ];

  return (
    <>
      {/* Trigger Button in Dashboard */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
          Issue Certificate
        </h3>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          Celebrate student achievements with beautiful certificates
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {milestones.map((m, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSelectedMilestone(m);
                setShowCertificate(true);
              }}
              className={`p-8 rounded-2xl bg-gradient-to-br ${m.color} text-white shadow-lg hover:shadow-2xl transition-all`}
            >
              <m.icon className="w-12 h-12 mx-auto mb-4" />
              <p className="font-bold text-lg">{m.label}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Certificate Modal */}
      <AnimatePresence>
        {showCertificate && selectedMilestone && (
          <CertificateTemplate
            student={student}
            milestone={selectedMilestone}
            date="15 Rajab 1446 AH • 12 February 2025"
            onClose={() => setShowCertificate(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
