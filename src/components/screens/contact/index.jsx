import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import Footer from "../../footer/index.jsx";
import Header from "../../header/index.jsx";
import { BuildingOffice2Icon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline'

export default function Contact() {
  const location = useLocation();
  const pathname = location.pathname;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [csrfToken, setCsrfToken] = useState('');
  const isFormVisible = submissionStatus !== 'success';

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await fetch('/csrf');
        const data = await response.json();
        setCsrfToken(data.csrf_token); // Assuming the token is in data.csrf_token
      } catch (error) {
        console.error('Error fetching CSRF token:', error);
      }
    };

    fetchCsrfToken();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.target);
    const formProps = Object.fromEntries(formData.entries());
    formProps.csrf_token = csrfToken;
    formProps.hp = '';

    try {
      const response = await fetch('/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formProps),
      });

      if (response.ok) {
        setSubmissionStatus('success');
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setIsSubmitting(false);
      setSubmissionStatus('error');
    }
  };

  return (
    <div>
      <Header pathname={pathname} />
      <div className="relative isolate bg-white border-b-4 border-black">
        <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-2">
          <div className="relative px-6 pb-20 pt-24 sm:pt-32 lg:static lg:px-8 lg:py-48">
            <div className="mx-auto max-w-xl lg:mx-0 lg:max-w-lg">
              <h2 className="text-3xl font-bold tracking-tight text-black">Contact Us!</h2>
              <p className="mt-6 text-lg leading-8 text-gray-700">
                Send us a message and we will respond ASAP.
              </p>
              <dl className="mt-10 space-y-4 text-base leading-7 text-gray-700">
                <div className="flex gap-x-4">
                  <dt className="flex-none">
                    <span className="sr-only">Address</span>
                    <BuildingOffice2Icon className="h-7 w-6 text-gray-400" aria-hidden="true" />
                  </dt>
                  <dd>
                    1 Broadway
                    <br />
                    Cambridge, MA 02142
                  </dd>
                </div>
                <div className="flex gap-x-4">
                  <dt className="flex-none">
                    <span className="sr-only">Email</span>
                    <EnvelopeIcon className="h-7 w-6 text-gray-400" aria-hidden="true" />
                  </dt>
                  <dd>
                    <a className="hover:text-black" href="mailto:hello@example.com">
                      hello@example.com
                    </a>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
          {submissionStatus === 'success' && (
            <div className="relative px-6 pb-20 pt-24 sm:pt-32 lg:static lg:px-8 lg:py-48">
              <div className="mx-auto max-w-xl lg:mx-0 lg:max-w-lg">
                <h2 className="text-3xl font-bold tracking-tight text-black">We received your message</h2>
                <p className="mt-6 text-lg leading-8 text-gray-700">
                  We will respond as soon as possible.
                </p>
              </div>
            </div>
          )}
          <div className={isFormVisible ? "visible" : "invisible"}>
            <form onSubmit={handleSubmit} method="POST" className="px-6 pb-24 pt-20 sm:pb-32 lg:px-8 lg:py-48">
              <div className="mx-auto max-w-xl lg:mr-0 lg:max-w-lg">
                <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                  <div>
                    <input type="hidden" name="csrf_token" value="1111111" />
                    <input type="hidden" name="hp" value="" />
                    <label htmlFor="first_name" className="block text-sm font-bold leading-6 text-black">
                      First name
                    </label>
                    <div className="mt-2.5">
                      <input
                        type="text"
                        name="first_name"
                        id="first_name"
                        autoComplete="first-name"
                        required
                        className="block w-full rounded-md border-2 border-black px-3.5 py-2 text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="last_name" className="block text-sm font-bold leading-6 text-black">
                      Last name
                    </label>
                    <div className="mt-2.5">
                      <input
                        type="text"
                        name="last_name"
                        id="last_name"
                        autoComplete="last-name"
                        required
                        className="block w-full rounded-md border-2 border-black px-3.5 py-2 text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="email" className="block text-sm font-bold leading-6 text-black">
                      Email Address
                    </label>
                    <div className="mt-2.5">
                      <input
                        type="email"
                        name="email_address"
                        id="email_address"
                        autoComplete="email"
                        required
                        className="block w-full rounded-md border-2 border-black px-3.5 py-2 text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="phone_number" className="block text-sm font-bold leading-6 text-black">
                      Phone number
                    </label>
                    <div className="mt-2.5">
                      <input
                        type="tel"
                        name="phone_number"
                        id="phone_number"
                        autoComplete="tel"
                        className="block w-full rounded-md border-2 border-black px-3.5 py-2 text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="message" className="block text-sm font-bold leading-6 text-black">
                      Message
                    </label>
                    <div className="mt-2.5">
                      <textarea
                        name="message"
                        id="message"
                        rows={4}
                        required
                        className="block w-full rounded-md border-2 border-black px-3.5 py-2 text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-black sm:text-sm sm:leading-6"
                        defaultValue={''}
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-8 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="relative inline-block px-4 py-2 font-bold text-white bg-black border-4 border-black hover:bg-gray-900"
                  >
                    <div className="absolute top-0 left-0 w-full h-full border-2 border-white"></div>
                    {isSubmitting ? (
                      <>
                        <svg
                          className="inline mr-2 -mt-1 h-5 w-5 animate-spin text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0012 20c4.411 0 8-3.589 8-8h-2c0 3.309-2.691 6-6 6-3.309 0-6-2.691-6-6H6c0 4.411 3.589 8 8 8z"
                          />
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      "Send message"
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}