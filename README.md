# Resilience Exercise

### Goal

Implement aspects of the system in biopharmaceutical manufacturing called the Manufacturing Execution System (MES), which sits atop the systems involved in the manufacturing process. It’s not the kind or product we build on our team, but it is very relevant to our business!

Traditionally, biopharmaceutical products (medicines, therapies, vaccines, etc.) are produced by manufacturing systems in batches. For a given product there is a defined process for producing the batches involving various types of systems such as bioreactors, scales, drying machines, water purification, etc.

These processes are precisely developed with safety and quality of utmost concern. If a process is not run properly or an anomaly occurs undetected during the production of a batch the efficacy or safety of the resulting product must be considered compromised.

In biopharmaceutical production, products have specified Critical Quality Attributes (CQA) that define the qualities a product must have to be fit for its purpose and safe. To support these, the processes have Critical Process Parameters (CPP) that define the bounds within which the process must remain to produce a successful batch (a product that is both safe and effective).

Sometimes the execution of a process requires the actions of a human operator with the MES providing a user interface to assist the operator in performing their part. Your “mini-MES” implementation will be a simple UI that enables an operator to monitor and execute a custom process by controlling a bioreactor, which is a device that takes biologically active ingredients in a vessel so they can interact in a controlled way.

You can use whatever framework (or not!) you want to use to implement your UI. We provide a REST API to interact with this simplified version of a bioreactor to allow the operator to monitor and execute the process.

The simplified process for the operator to execute consists of the following steps:

1. Open the fill valve to allow material in.
2. Let the vessel fill to (70 +/-2)% full.
3. If the pressure of the vessel reaches 200 kPa the batch should be aborted by opening the output valve, so the material is let out and the process is stopped.
4. When the temperature of the container reaches (80 +/-1) degrees Celsius, open the output valve to let the material out.

Once the vessel is emptied this fictional batch will be considered done.

As important as the product of the batch itself is the “Batch Record” which reports the activity for the batch. At the completion of the batch your mini-MES should report a Batch Record that provides the following information:

• Whether the batch was considered successful
• Actual fill level reached in the vessel
• Temperature range during the process
• pH range during the process
• Pressure range during the process
• Total time for the process
• Whether the CPP of +/- 2% for vessel fill level was met
• Whether the CPP of +/- 1 degree Celsius for maximum temperature was met
• Whether the CPP of pressure held below 200 kPa was met

### UI Considerations

You should provide controls to the operator to:

• Open or Close the input valve
• Open or Close the output valve

You should indicate to the operator the next step to be taken and warn as the conditions approach, so that they are ready to act.

You should provide at least current values to the operator for Pressure, Temperature, and pH.

Base URL for the fictional bioreactor REST API: http://mini-mes.resilience.com 

### REST API Specification

*bioreactor/0*

GET 

Used to get a bioreactor for use. Returns the <id> of the bioreactor to use. 


*bioreactor/<id>*

GET 

Returns the current readings for the interior of the vessel of the bioreactor. 

Fill-level – Percentage 
pH 
Pressure – kPa 
Temperature – degrees Celsius 
 

*bioreactor/<id>/input-valve*

GET 

Whether the state of the input valve is open or closed. 

PUT 

Used to set the state of the input valve to open or closed. 


*bioreactor/<id>/output-valve*

GET 

Whether the state of the output valve is open or closed. 

PUT 

Used to set the state an output valve to open or closed. 