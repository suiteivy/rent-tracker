import { supabase } from '../supabaseClient';

// Maintenance Request Service - Sprint 1 Skeleton
export const maintenanceService = {
  
  // Create maintenance request (Sprint 3)
  async createRequest(requestData) {
    try {
      const { data, error } = await supabase
        .from('maintenance_requests')
        .insert([{
          tenant_id: requestData.tenantId,
          property_id: requestData.propertyId,
          unit_id: requestData.unitId,
          whatsapp_message_id: requestData.whatsappMessageId,
          whatsapp_phone_number: requestData.phoneNumber,
          title: requestData.title,
          description: requestData.description,
          category: requestData.category,
          priority: requestData.priority,
          location: requestData.location,
          status: 'pending',
          images: requestData.images || [],
          whatsapp_thread: {
            original_message: requestData.originalMessage,
            messages: []
          }
        }])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error creating maintenance request:', error);
      return { success: false, error: error.message };
    }
  },

  // Get all maintenance requests
  async getAllRequests(filters = {}) {
    try {
      let query = supabase
        .from('maintenance_requests')
        .select(`
          *,
          tenant:tenants(id, name, phone),
          property:properties(id, name, address),
          unit:units(id, unit_number)
        `)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }
      if (filters.priority && filters.priority !== 'all') {
        query = query.eq('priority', filters.priority);
      }
      if (filters.category && filters.category !== 'all') {
        query = query.eq('category', filters.category);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching maintenance requests:', error);
      return { success: false, error: error.message };
    }
  },

  // Update request status (Sprint 3)
  async updateRequestStatus(requestId, status) {
    try {
      const updatePayload = {
        status,
        updated_at: new Date().toISOString()
      };

      // Add timestamp based on status
      if (status === 'acknowledged') {
        updatePayload.acknowledged_at = new Date().toISOString();
      } else if (status === 'in_progress') {
        updatePayload.started_at = new Date().toISOString();
      } else if (status === 'completed') {
        updatePayload.completed_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('maintenance_requests')
        .update(updatePayload)
        .eq('id', requestId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error updating maintenance request:', error);
      return { success: false, error: error.message };
    }
  },

  // Assign technician (Sprint 3)
  async assignTechnician(requestId, technicianName, estimatedCost = null) {
    try {
      const { data, error } = await supabase
        .from('maintenance_requests')
        .update({
          assigned_to: technicianName,
          estimated_cost: estimatedCost,
          status: 'acknowledged',
          acknowledged_at: new Date().toISOString()
        })
        .eq('id', requestId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error assigning technician:', error);
      return { success: false, error: error.message };
    }
  },

  // Get maintenance stats
  async getMaintenanceStats() {
    try {
      // Sprint 1: Return mock stats
      // Sprint 3: Replace with real Supabase query
      return {
        success: true,
        data: {
          total: 0,
          pending: 0,
          in_progress: 0,
          completed: 0,
          emergency: 0
        }
      };
    // eslint-disable-next-line no-unreachable
    } catch (error) {
      console.error('Error fetching maintenance stats:', error);
      return { success: false, error: error.message };
    }
  }
};

export default maintenanceService;