import { supabase } from '../lib/supabase';
import { useEffect, useState } from 'react';

// Define the type for a lead
interface Lead {
  id: string;
  title: string;
  description: string;
  source: string;
  created_at?: string; // Optional field
}

export default function Home() {
  // State for the list of leads
  const [leads, setLeads] = useState<Lead[]>([]);

  // State for the form inputs
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [source, setSource] = useState('');

  // Fetch leads from Supabase
  useEffect(() => {
    const fetchLeads = async () => {
      const { data, error } = await supabase.from('leads').select('*');

      if (error) {
        console.error('Error fetching leads:', error);
      } else {
        setLeads(data as Lead[]);
      }
    };

    fetchLeads();
  }, []);

  // Handle form submission
  const handleSubmit = async () => {
    // Validate form inputs
    if (!title || !description || !source) {
      alert('Please fill out all fields.');
      return;
    }

    // Insert the new lead into the Supabase table
    const { error } = await supabase
      .from('leads')
      .insert([{ title, description, source }]);

    if (error) {
      console.error('Error creating lead:', error);
    } else {
      // Clear the form inputs
      setTitle('');
      setDescription('');
      setSource('');

      // Refresh the list of leads
      const { data: newData, error: fetchError } = await supabase
        .from('leads')
        .select('*');

      if (fetchError) {
        console.error('Error fetching updated leads:', fetchError);
      } else {
        setLeads(newData as Lead[]);
      }

      alert('Lead created!');
    }
  };

  return (
    <div>
      <h1>Welcome to My Lead Platform!</h1>

      {/* Form to create a new lead */}
      <div>
        <h2>Create a New Lead</h2>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="text"
          placeholder="Source"
          value={source}
          onChange={(e) => setSource(e.target.value)}
        />
        <button onClick={handleSubmit}>Create Lead</button>
      </div>

      {/* Display the list of leads */}
      <ul>
        {leads.map((lead) => (
          <li key={lead.id}>
            <h2>{lead.title}</h2>
            <p>{lead.description}</p>
            <p>Source: {lead.source}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}