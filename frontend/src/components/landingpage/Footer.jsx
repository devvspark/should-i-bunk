export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-16">

        {/* Top Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 text-center sm:text-left">

          {/* Brand */}
          <div className="sm:col-span-2 md:col-span-1">
            <div className="flex items-center justify-center sm:justify-start gap-2 font-bold text-lg text-gray-900">
              <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center">
                S
              </div>
              Should I Bunk?
            </div>
            <p className="mt-4 text-sm text-gray-600">
              The ultimate tool for college students to track and manage
              attendance with data-driven insights.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Features</li>
              <li>Risk Engine</li>
              <li>Mobile App</li>
              <li>Pricing</li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>About Us</li>
              <li>Blog</li>
              <li>Careers</li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Privacy Policy</li>
              <li>Terms & Conditions</li>
              <li>Security</li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© 2024 Should I Bunk? · Built for students, by students.</p>
          <div className="flex gap-4">
            <span className="cursor-pointer hover:text-gray-700">
              Cookie Settings
            </span>
            <span className="cursor-pointer hover:text-gray-700">
              Accessibility
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
