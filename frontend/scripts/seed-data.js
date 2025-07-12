import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, '../.env.local') });

import connectToDB from '../lib/db.js';
import User from '../models/User.js';
import Swap from '../models/Swap.js';
import Notification from '../models/Notification.js';

async function seedData() {
  try {
    // Debug: Check environment variables
    console.log('MONGODB_URI:', process.env.MONGODB_URI);
    console.log('Environment variables loaded:', Object.keys(process.env).filter(key => key.includes('MONGODB')));
    
    // Connect to database
    await connectToDB();
    console.log('Connected to database');

    // Clear existing data
    await User.deleteMany({});
    await Swap.deleteMany({});
    await Notification.deleteMany({});
    console.log('Cleared existing data');

    // Create sample users
    const users = [
      {
        name: 'John Smith',
        email: 'john@example.com',
        password: 'password123',
        bio: 'Full-stack developer with 5 years of experience in React, Node.js, and Python.',
        skillsOffered: [
          { name: 'JavaScript', level: 'advanced', description: 'ES6+, React, Node.js' },
          { name: 'Python', level: 'intermediate', description: 'Django, Flask, Data Analysis' },
          { name: 'MongoDB', level: 'intermediate', description: 'Database design and optimization' }
        ],
        skillsWanted: [
          { name: 'Machine Learning', priority: 'high', description: 'TensorFlow, scikit-learn' },
          { name: 'Mobile Development', priority: 'medium', description: 'React Native, Flutter' }
        ],
        location: 'San Francisco, CA',
        profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        rating: { average: 4.8, count: 12 },
        totalSwaps: { completed: 10, pending: 2 },
        isVerified: true
      },
      {
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        password: 'password123',
        bio: 'UI/UX designer passionate about creating beautiful and functional user experiences.',
        skillsOffered: [
          { name: 'Figma', level: 'expert', description: 'UI/UX design and prototyping' },
          { name: 'Adobe XD', level: 'advanced', description: 'Interactive prototypes' },
          { name: 'User Research', level: 'intermediate', description: 'User interviews and testing' }
        ],
        skillsWanted: [
          { name: 'Design Systems', priority: 'high', description: 'Component libraries and design tokens' },
          { name: 'Accessibility', priority: 'medium', description: 'WCAG guidelines and inclusive design' }
        ],
        location: 'New York, NY',
        profilePhoto: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        rating: { average: 4.9, count: 8 },
        totalSwaps: { completed: 6, pending: 2 },
        isVerified: true
      },
      {
        name: 'Mike Chen',
        email: 'mike@example.com',
        password: 'password123',
        bio: 'Professional photographer specializing in portrait and landscape photography.',
        skillsOffered: [
          { name: 'Photography', level: 'expert', description: 'Portrait and landscape photography' },
          { name: 'Lightroom', level: 'advanced', description: 'Photo editing and color grading' },
          { name: 'Composition', level: 'advanced', description: 'Visual storytelling and framing' }
        ],
        skillsWanted: [
          { name: 'Video Editing', priority: 'medium', description: 'Premiere Pro, After Effects' },
          { name: 'Drone Photography', priority: 'low', description: 'Aerial photography techniques' }
        ],
        location: 'Los Angeles, CA',
        profilePhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        rating: { average: 4.7, count: 15 },
        totalSwaps: { completed: 12, pending: 3 },
        isVerified: true
      },
      {
        name: 'Emma Wilson',
        email: 'emma@example.com',
        password: 'password123',
        bio: 'Content writer and copywriter with expertise in digital marketing and SEO.',
        skillsOffered: [
          { name: 'Content Writing', level: 'advanced', description: 'Blog posts, articles, and web content' },
          { name: 'SEO', level: 'intermediate', description: 'Keyword research and optimization' },
          { name: 'Email Marketing', level: 'intermediate', description: 'Newsletter campaigns and automation' }
        ],
        skillsWanted: [
          { name: 'Digital Marketing', priority: 'high', description: 'Social media and PPC campaigns' },
          { name: 'Branding', priority: 'medium', description: 'Brand strategy and identity' }
        ],
        location: 'Chicago, IL',
        profilePhoto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        rating: { average: 4.6, count: 6 },
        totalSwaps: { completed: 4, pending: 2 },
        isVerified: false
      },
      {
        name: 'Alex Rodriguez',
        email: 'alex@example.com',
        password: 'password123',
        bio: 'Professional chef with 10 years of experience in fine dining and international cuisine.',
        skillsOffered: [
          { name: 'Cooking', level: 'expert', description: 'Fine dining and international cuisine' },
          { name: 'Baking', level: 'advanced', description: 'Pastries, breads, and desserts' },
          { name: 'Menu Planning', level: 'advanced', description: 'Seasonal menus and cost control' }
        ],
        skillsWanted: [
          { name: 'Food Photography', priority: 'medium', description: 'Professional food styling and photography' },
          { name: 'Wine Pairing', priority: 'low', description: 'Sommelier skills and wine knowledge' }
        ],
        location: 'Miami, FL',
        profilePhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
        rating: { average: 4.9, count: 20 },
        totalSwaps: { completed: 18, pending: 2 },
        isVerified: true
      }
    ];

    // Use User.create() in a loop to ensure pre-save hooks (password hashing) are triggered
    const createdUsers = [];
    for (const user of users) {
      const created = await User.create(user);
      createdUsers.push(created);
    }
    console.log(`Created ${createdUsers.length} users`);

    // Create sample swaps
    const swaps = [
      {
        requester: createdUsers[0]._id, // John
        recipient: createdUsers[1]._id,  // Sarah
        requestedSkill: {
          name: 'Figma',
          description: 'UI/UX design for React app'
        },
        offeredSkill: {
          name: 'JavaScript',
          description: 'JavaScript optimization and React development'
        },
        status: 'accepted',
        message: 'I need help creating a beautiful UI design for my React app. In exchange, I can help you with JavaScript optimization.',
        scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
        isRead: { requester: true, recipient: true }
      },
      {
        requester: createdUsers[2]._id, // Mike
        recipient: createdUsers[0]._id,  // John
        requestedSkill: {
          name: 'React',
          description: 'Portfolio website development'
        },
        offeredSkill: {
          name: 'Photography',
          description: 'Professional photography for projects'
        },
        status: 'pending',
        message: 'I need help building a portfolio website. I can take professional photos for your projects in return.',
        scheduledDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
        isRead: { requester: false, recipient: false }
      },
      {
        requester: createdUsers[3]._id, // Emma
        recipient: createdUsers[4]._id,  // Alex
        requestedSkill: {
          name: 'Cooking',
          description: 'Cooking lessons for food blog content'
        },
        offeredSkill: {
          name: 'Content Writing',
          description: 'Content strategy and SEO for food blog'
        },
        status: 'completed',
        message: 'I need help writing content for my food blog. I can help you with content strategy and SEO.',
        scheduledDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
        completedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        feedback: {
          requesterRating: 5,
          requesterComment: 'Excellent cooking skills and great teacher!',
          recipientRating: 4,
          recipientComment: 'Very helpful with content writing and SEO tips.'
        },
        isRead: { requester: true, recipient: true }
      },
      {
        requester: createdUsers[1]._id, // Sarah
        recipient: createdUsers[2]._id,  // Mike
        requestedSkill: {
          name: 'Photography',
          description: 'Product photography for design portfolio'
        },
        offeredSkill: {
          name: 'UI Design',
          description: 'UI/UX design services'
        },
        status: 'accepted',
        message: 'I need high-quality product photos for my design portfolio. I can help you with UI/UX design.',
        scheduledDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        isRead: { requester: true, recipient: false }
      }
    ];

    const createdSwaps = await Swap.insertMany(swaps);
    console.log(`Created ${createdSwaps.length} swaps`);

    // Create sample notifications
    const notifications = [
      {
        recipient: createdUsers[0]._id,
        sender: createdUsers[2]._id,
        type: 'swap_request',
        title: 'New Swap Request',
        message: 'Mike Chen wants to swap Photography for React development',
        relatedSwap: createdSwaps[1]._id,
        isRead: false
      },
      {
        recipient: createdUsers[1]._id,
        sender: createdUsers[0]._id,
        type: 'swap_accepted',
        title: 'Swap Accepted',
        message: 'John Smith accepted your swap request for UI Design',
        relatedSwap: createdSwaps[3]._id,
        isRead: true
      },
      {
        recipient: createdUsers[3]._id,
        sender: createdUsers[4]._id,
        type: 'swap_completed',
        title: 'Swap Completed',
        message: 'Your swap with Alex Rodriguez has been completed successfully',
        relatedSwap: createdSwaps[2]._id,
        isRead: false
      }
    ];

    const createdNotifications = await Notification.insertMany(notifications);
    console.log(`Created ${createdNotifications.length} notifications`);

    console.log('✅ Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Users: ${createdUsers.length}`);
    console.log(`- Swaps: ${createdSwaps.length}`);
    console.log(`- Notifications: ${createdNotifications.length}`);
    
    console.log('\n🔑 Test Login Credentials:');
    console.log('Email: john@example.com, Password: password');
    console.log('Email: sarah@example.com, Password: password');
    console.log('Email: mike@example.com, Password: password');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedData(); 