import * as functions from 'firebase-functions';
import { db, MEETINGS_COLLECTION } from '../config/firebase';
import { formatError } from '../utils/helpers';

/**
 * Cloud Function to get all meetings
 * This retrieves all meeting data from Firestore
 */
export const getMeetings = functions.https.onCall(async (request, context) => {
  try {
    const userId = request.data?.userId;
    
    let meetingsRef = db.collection(MEETINGS_COLLECTION);
    
    let meetingsQuery;
    if (userId) {
      meetingsQuery = meetingsRef.where('userId', '==', userId).orderBy('createdAt', 'desc');
    } else {
      meetingsQuery = meetingsRef.orderBy('createdAt', 'desc');
    }
    
    const snapshot = await meetingsQuery.get();
    
    const meetings = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        dateTime: data.dateTime.toDate().toISOString(),
        createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
      };
    });
    
    return { 
      success: true,
      meetings 
    };
  } catch (error) {
    console.error('Error getting meetings from Firestore:', error);
    return { 
      success: false, 
      meetings: [],
      error: formatError(error) 
    };
  }
});
