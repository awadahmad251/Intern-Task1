import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { Edit2 } from 'react-feather';
import './PrivacyPolicyPage.css';

const policySections = [
  {
    title: 'Information We Collect',
    body: [
      'When you use the Services, we may collect certain information about you, including:',
      '1. Personal Information: We may collect personal information such as your name, email address, phone number, business information, and payment information.',
      '2. Usage Information: We may collect information about your use of the Services, including the pages you visit, the time and date of your visit, the amount of time you spend on each page, and your IP address.',
      '3. Device Information: We may collect information about the device you use to access the Services, including the type of device, operating system, and browser.'
    ]
  },
  {
    title: 'How We Use Your Information',
    body: [
      'We may use your information for the following purposes:',
      '1. To provide and improve the Services: We use your information to provide the Services, personalize your experience, and improve the Services.',
      '2. To communicate with you: We use your information to communicate with you about the Services, including sending you updates and notifications.',
      '3. To process transactions: We use your information to process transactions, including payment processing.',
      '4. To comply with legal obligations: We may use your information to comply with applicable laws and regulations.'
    ]
  },
  {
    title: 'Sharing Your Information',
    body: [
      'We may share your information with third parties in the following circumstances:',
      '1. Service Providers: We may share your information with third-party service providers who help us operate the Services and process transactions.',
      '2. Business Transfers: We may share your information in connection with a merger, acquisition, or sale of all or a portion of our business.',
      '3. Legal Requirements: We may disclose your information if required to do so by law or in response to a subpoena or other legal process.',
      '4. Safety and Security: We may disclose your information if we believe it is necessary to investigate, prevent, or take action regarding illegal activities, suspected fraud, or threats to the safety of any person.'
    ]
  }
];

const policyIntro = [
  'At Karyana, we take your privacy and security very seriously. This Privacy Policy explains how we collect, use, disclose, and protect your personal information when you use our online B2B store for retailers to buy bulk items (the "Services").',
  'By using the Services, you agree to the terms and conditions of this Privacy Policy. If you do not agree to the terms and conditions of this Privacy Policy, please do not use the Services.'
];

const policyFooter = [
  {
    title: 'Security of Your Information',
    body: 'We take reasonable measures to protect your information from unauthorized access, use, or disclosure. However, no transmission of data over the Internet is completely secure, and we cannot guarantee the security of your personal information.'
  },
  {
    title: 'Children\'s Privacy',
    body: 'The Services are not intended for use by children under the age of 18, and we do not knowingly collect personal information from children under the age of 18. If we learn that we have collected personal information from a child under the age of 18, we will take steps to delete the information as soon as possible.'
  },
  {
    title: 'Changes to this Privacy Policy',
    body: 'We may update this Privacy Policy from time to time. If we make material changes to this Privacy Policy, we will notify you by email or by posting a notice on the Services prior to the effective date of the changes.'
  },
  {
    title: 'Contact Us',
    body: 'If you have any questions or concerns about this Privacy Policy, please contact us at support@karyana.com.'
  }
];

const PolicyBlock = ({ title, children }) => (
  <section className="policy-block">
    <h3>{title}</h3>
    <div>{children}</div>
  </section>
);

const PrivacyPolicyPage = () => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="policy-page">
      <Sidebar />
      <div className="policy-main-content">
        <Header />

        <div className="policy-container">
          <div className="policy-topbar">
            <h1 className="policy-heading">Privacy Policy</h1>
            <button type="button" className="policy-edit-btn" onClick={() => setIsEditing(true)}>
              <Edit2 size={15} />
              Edit
            </button>
          </div>

          <div className="policy-card">
            <h2>Privacy Policy for Karyana App</h2>
            {policyIntro.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            {policySections.map((section) => (
              <PolicyBlock key={section.title} title={section.title}>
                {section.body.map((line) => <p key={line}>{line}</p>)}
              </PolicyBlock>
            ))}
            {policyFooter.map((section) => (
              <PolicyBlock key={section.title} title={section.title}>
                <p>{section.body}</p>
              </PolicyBlock>
            ))}
          </div>
        </div>

        {isEditing && (
          <div className="policy-modal-overlay" onClick={() => setIsEditing(false)}>
            <div className="policy-modal" onClick={(event) => event.stopPropagation()}>
              <div className="policy-modal-title">Edit Privacy Policy</div>
              <div className="policy-modal-body">
                <div className="policy-modal-preview" contentEditable suppressContentEditableWarning>
                  <h2>Privacy Policy for Karyana App</h2>
                  {policyIntro.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  {policySections.map((section) => (
                    <PolicyBlock key={section.title} title={section.title}>
                      {section.body.map((line) => <p key={line}>{line}</p>)}
                    </PolicyBlock>
                  ))}
                </div>
              </div>
              <div className="policy-modal-footer">
                <button type="button" className="policy-cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
                <button type="button" className="policy-save-btn" onClick={() => setIsEditing(false)}>Save</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;