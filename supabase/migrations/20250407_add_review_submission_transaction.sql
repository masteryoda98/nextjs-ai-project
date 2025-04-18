-- Create a stored procedure for reviewing submissions with transaction support
CREATE OR REPLACE FUNCTION review_submission_transaction(
  p_submission_id INT,
  p_status TEXT,
  p_revision_notes TEXT,
  p_reviewer_id TEXT,
  p_feedback TEXT,
  p_rating INT
) RETURNS VOID AS $$
DECLARE
  v_campaign_id INT;
  v_creator_id TEXT;
  v_payment_rate DECIMAL;
BEGIN
  -- Start transaction
  BEGIN
    -- Update the submission
    UPDATE submissions
    SET 
      status = p_status,
      revision_notes = p_revision_notes,
      reviewed_at = NOW(),
      published_at = CASE WHEN p_status = 'PUBLISHED' THEN NOW() ELSE NULL END
    WHERE id = p_submission_id
    RETURNING campaign_id, creator_id INTO v_campaign_id, v_creator_id;
    
    -- If approved or published, create a payment record
    IF p_status IN ('APPROVED', 'PUBLISHED') THEN
      -- Get the payment rate
      SELECT payment_rate INTO v_payment_rate
      FROM campaign_creators
      WHERE campaign_id = v_campaign_id AND creator_id = v_creator_id;
      
      -- Create payment record
      INSERT INTO payments (
        submission_id,
        user_id,
        amount,
        status,
        description,
        created_at
      ) VALUES (
        p_submission_id,
        v_creator_id,
        v_payment_rate,
        'PENDING',
        'Payment for approved submission',
        NOW()
      );
    END IF;
    
    -- Add feedback if provided
    IF p_feedback IS NOT NULL THEN
      INSERT INTO feedback (
        submission_id,
        sender_id,
        receiver_id,
        content,
        rating,
        created_at
      ) VALUES (
        p_submission_id,
        p_reviewer_id,
        v_creator_id,
        p_feedback,
        p_rating,
        NOW()
      );
    END IF;
    
    -- Commit transaction
    COMMIT;
  EXCEPTION
    WHEN OTHERS THEN
      -- Rollback transaction on error
      ROLLBACK;
      RAISE;
  END;
END;
$$ LANGUAGE plpgsql;
